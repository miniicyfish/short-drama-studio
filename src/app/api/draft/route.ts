import { callAI } from '@/lib/ai';
import { DraftRequest, ScriptSkeletonAct } from '@/lib/gameTypes';
import {
  assembleActDrafts,
  extractDefaultReactions,
  ReactionLine,
  scriptSkeleton,
} from '@/lib/gameData';
import { buildDraftPrompt } from '@/lib/prompts';
import { sanitizeVisibleActDrafts } from '@/lib/visibleText';

export const maxDuration = 300;

type DraftAIReactions = { reactions?: Record<string, ReactionLine[]> };

interface ActGenerationResult {
  actId: string;
  source: 'ai' | 'fallback:parse-null' | 'fallback:error';
  reactions: Record<string, ReactionLine[]>;
  durationMs: number;
  contentLength?: number;
  error?: string;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateActReactions(
  body: DraftRequest,
  act: ScriptSkeletonAct
): Promise<ActGenerationResult> {
  const startedAt = Date.now();

  try {
    const prompt = buildDraftPrompt({ ...body, scriptSkeleton: [act] });
    const result = await callAI(prompt.system, prompt.user, [], 0.85, 2400, 90000);
    const parsed = result.parsed as DraftAIReactions | null;

    if (parsed?.reactions && typeof parsed.reactions === 'object') {
      return {
        actId: act.actId,
        source: 'ai',
        reactions: parsed.reactions,
        durationMs: Date.now() - startedAt,
        contentLength: result.content.length,
      };
    }

    return {
      actId: act.actId,
      source: 'fallback:parse-null',
      reactions: {},
      durationMs: Date.now() - startedAt,
      contentLength: result.content.length,
    };
  } catch (error) {
    return {
      actId: act.actId,
      source: 'fallback:error',
      reactions: {},
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : 'unknown error',
    };
  }
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  const body = (await request.json()) as DraftRequest;

  // 用默认反应作为 fallback
  const defaultReactions = extractDefaultReactions(body.scriptSkeleton, body.casting);

  if (!process.env.AI_API_KEY) {
    console.warn('[ai-debug]', JSON.stringify({
      route: 'draft',
      source: 'fallback:no-key',
      durationMs: Date.now() - startedAt,
    }));
    const episodeDraft = assembleActDrafts(body.scriptSkeleton, defaultReactions);
    return Response.json(
      { episodeDraft: sanitizeVisibleActDrafts(episodeDraft) },
      { headers: { 'x-ai-source': 'fallback:no-key' } }
    );
  }

  try {
    const actResults = await Promise.all(
      body.scriptSkeleton.map(async (act, index) => {
        // The current provider rate-limits to roughly one request per second.
        await delay(index * 1200);
        return generateActReactions(body, act);
      })
    );
    const aiActCount = actResults.filter((result) => result.source === 'ai').length;
    const parseNullCount = actResults.filter((result) => result.source === 'fallback:parse-null').length;
    const errorCount = actResults.filter((result) => result.source === 'fallback:error').length;
    const source =
      aiActCount === body.scriptSkeleton.length
        ? 'ai:split'
        : aiActCount > 0
          ? 'ai:partial'
          : errorCount > 0
            ? 'fallback:error'
            : 'fallback:parse-null';

    const aiReactions = actResults.reduce<Record<string, ReactionLine[]>>((acc, result) => {
      return { ...acc, ...result.reactions };
    }, {});
    const reactions = { ...defaultReactions, ...aiReactions };

    const episodeDraft = assembleActDrafts(body.scriptSkeleton, reactions);
    console.info('[ai-debug]', JSON.stringify({
      route: 'draft',
      source,
      durationMs: Date.now() - startedAt,
      aiActCount,
      parseNullCount,
      errorCount,
      actResults: actResults.map((result) => ({
        actId: result.actId,
        source: result.source,
        durationMs: result.durationMs,
        contentLength: result.contentLength,
        error: result.error,
      })),
    }));
    return Response.json(
      { episodeDraft: sanitizeVisibleActDrafts(episodeDraft) },
      { headers: { 'x-ai-source': source } }
    );
  } catch (error) {
    console.error('Draft error:', error);
    console.warn('[ai-debug]', JSON.stringify({
      route: 'draft',
      source: 'fallback:error',
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : 'unknown error',
    }));
    const episodeDraft = assembleActDrafts(body.scriptSkeleton, defaultReactions);
    return Response.json(
      { episodeDraft: sanitizeVisibleActDrafts(episodeDraft) },
      { headers: { 'x-ai-source': 'fallback:error' } }
    );
  }
}
