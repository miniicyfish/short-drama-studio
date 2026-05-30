import { callAI } from '@/lib/ai';
import { ReviseActRequest } from '@/lib/gameTypes';
import {
  assembleActDrafts,
  extractDefaultReactions,
  ReactionLine,
} from '@/lib/gameData';
import { buildReviseActPrompt } from '@/lib/prompts';
import { sanitizeVisibleActDrafts } from '@/lib/visibleText';

export const maxDuration = 120;

export async function POST(request: Request) {
  const startedAt = Date.now();
  const body = (await request.json()) as ReviseActRequest;

  // 用默认反应作为 fallback，只取当前幕
  const defaultReactions = extractDefaultReactions(
    [body.scriptSkeletonAct],
    body.actorStates.map((s) => ({
      scriptRoleId: s.scriptRoleId,
      scriptRoleName: s.scriptRoleName,
      actorId: s.actorId,
      actorName: s.actorName,
    }))
  );

  if (!process.env.AI_API_KEY) {
    console.warn('[ai-debug]', JSON.stringify({
      route: 'revise-act',
      source: 'fallback:no-key',
      actId: body.actId,
      durationMs: Date.now() - startedAt,
    }));
    const [revisedAct] = assembleActDrafts([body.scriptSkeletonAct], defaultReactions);
    return Response.json(
      { revisedAct: sanitizeVisibleActDrafts([revisedAct])[0] },
      { headers: { 'x-ai-source': 'fallback:no-key' } }
    );
  }

  try {
    const prompt = buildReviseActPrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.82, 4000, 90000);
    const parsed = result.parsed as { reactions?: Record<string, ReactionLine[]> } | null;
    const source = parsed?.reactions && typeof parsed.reactions === 'object' ? 'ai' : 'fallback:parse-null';

    const reactions =
      parsed?.reactions && typeof parsed.reactions === 'object'
        ? { ...defaultReactions, ...parsed.reactions }
        : defaultReactions;

    const [revisedAct] = assembleActDrafts([body.scriptSkeletonAct], reactions);
    console.info('[ai-debug]', JSON.stringify({
      route: 'revise-act',
      source,
      actId: body.actId,
      durationMs: Date.now() - startedAt,
      contentLength: result.content.length,
    }));
    return Response.json(
      { revisedAct: sanitizeVisibleActDrafts([revisedAct])[0] },
      { headers: { 'x-ai-source': source } }
    );
  } catch (error) {
    console.error('Revise act error:', error);
    console.warn('[ai-debug]', JSON.stringify({
      route: 'revise-act',
      source: 'fallback:error',
      actId: body.actId,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : 'unknown error',
    }));
    const [revisedAct] = assembleActDrafts([body.scriptSkeletonAct], defaultReactions);
    return Response.json(
      { revisedAct: sanitizeVisibleActDrafts([revisedAct])[0] },
      { headers: { 'x-ai-source': 'fallback:error' } }
    );
  }
}
