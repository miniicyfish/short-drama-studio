import { callAI } from '@/lib/ai';
import { DraftRequest } from '@/lib/gameTypes';
import {
  assembleActDrafts,
  extractDefaultReactions,
  ReactionLine,
  scriptSkeleton,
} from '@/lib/gameData';
import { buildDraftPrompt } from '@/lib/prompts';
import { sanitizeVisibleActDrafts } from '@/lib/visibleText';

export const maxDuration = 300;

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
    const prompt = buildDraftPrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.85, 8000, 285000);
    const parsed = result.parsed as { reactions?: Record<string, ReactionLine[]> } | null;
    const source = parsed?.reactions && typeof parsed.reactions === 'object' ? 'ai' : 'fallback:parse-null';

    const reactions =
      parsed?.reactions && typeof parsed.reactions === 'object'
        ? { ...defaultReactions, ...parsed.reactions }
        : defaultReactions;

    const episodeDraft = assembleActDrafts(body.scriptSkeleton, reactions);
    console.info('[ai-debug]', JSON.stringify({
      route: 'draft',
      source,
      durationMs: Date.now() - startedAt,
      contentLength: result.content.length,
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
