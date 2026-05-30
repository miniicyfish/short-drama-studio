import { callAI } from '@/lib/ai';
import { DraftRequest, ScriptSkeletonAct } from '@/lib/gameTypes';
import {
  assembleActDrafts,
  extractDefaultReactions,
  ReactionLine,
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

function filterActReactions(
  act: ScriptSkeletonAct,
  reactions: Record<string, ReactionLine[]>
) {
  const allowedBeatIds = new Set(
    act.beats
      .filter((beat) => beat.defaultSetReaction?.includes('<actor'))
      .map((beat) => beat.beatId)
  );
  const filtered: Record<string, ReactionLine[]> = {};

  for (const [beatId, lines] of Object.entries(reactions)) {
    if (!allowedBeatIds.has(beatId) || !Array.isArray(lines)) continue;

    const validLines = lines
      .filter((line) => typeof line?.speaker === 'string' && typeof line?.text === 'string')
      .map((line) => ({
        speaker: line.speaker.trim() || '片场',
        text: line.text.trim(),
        mood: typeof line.mood === 'string' ? line.mood.trim() : '',
      }))
      .filter((line) => line.text.length > 0)
      .slice(0, 3);

    if (validLines.length > 0) filtered[beatId] = validLines;
  }

  return filtered;
}

async function generateActReactions(
  body: DraftRequest,
  act: ScriptSkeletonAct
): Promise<ActGenerationResult> {
  const startedAt = Date.now();

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const prompt = buildDraftPrompt({ ...body, scriptSkeleton: [act] });
      const result = await callAI(prompt.system, prompt.user, [], 0.78, 1800, 180000);
      const parsed = result.parsed as DraftAIReactions | null;

      if (parsed?.reactions && typeof parsed.reactions === 'object') {
        const reactions = filterActReactions(act, parsed.reactions);
        return {
          actId: act.actId,
          source: 'ai',
          reactions,
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
      const message = error instanceof Error ? error.message : 'unknown error';
      if (attempt === 1 && /429|TooManyRequests|rate limit/i.test(message)) {
        await delay(2500);
        continue;
      }

      return {
        actId: act.actId,
        source: 'fallback:error',
        reactions: {},
        durationMs: Date.now() - startedAt,
        error: message,
      };
    }
  }

  return {
    actId: act.actId,
    source: 'fallback:error',
    reactions: {},
    durationMs: Date.now() - startedAt,
    error: 'AI generation exhausted retries',
  };
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
        await delay(index * 1800);
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
