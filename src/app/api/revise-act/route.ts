import { callAI } from '@/lib/ai';
import { ReviseActRequest } from '@/lib/gameTypes';
import {
  assembleActDrafts,
  extractDefaultReactions,
  ReactionLine,
} from '@/lib/gameData';
import { buildReviseActPrompt } from '@/lib/prompts';
import { sanitizeVisibleActDrafts } from '@/lib/visibleText';

export async function POST(request: Request) {
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
    const [revisedAct] = assembleActDrafts([body.scriptSkeletonAct], defaultReactions);
    return Response.json({ revisedAct: sanitizeVisibleActDrafts([revisedAct])[0] });
  }

  try {
    const prompt = buildReviseActPrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.82, 4000, 30000);
    const parsed = result.parsed as { reactions?: Record<string, ReactionLine[]> } | null;

    const reactions =
      parsed?.reactions && typeof parsed.reactions === 'object'
        ? { ...defaultReactions, ...parsed.reactions }
        : defaultReactions;

    const [revisedAct] = assembleActDrafts([body.scriptSkeletonAct], reactions);
    return Response.json({ revisedAct: sanitizeVisibleActDrafts([revisedAct])[0] });
  } catch (error) {
    console.error('Revise act error:', error);
    const [revisedAct] = assembleActDrafts([body.scriptSkeletonAct], defaultReactions);
    return Response.json({ revisedAct: sanitizeVisibleActDrafts([revisedAct])[0] });
  }
}
