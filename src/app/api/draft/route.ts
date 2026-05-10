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

export async function POST(request: Request) {
  const body = (await request.json()) as DraftRequest;

  // 用默认反应作为 fallback
  const defaultReactions = extractDefaultReactions(body.scriptSkeleton, body.casting);

  if (!process.env.AI_API_KEY) {
    const episodeDraft = assembleActDrafts(body.scriptSkeleton, defaultReactions);
    return Response.json({ episodeDraft: sanitizeVisibleActDrafts(episodeDraft) });
  }

  try {
    const prompt = buildDraftPrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.85, 8000, 45000);
    const parsed = result.parsed as { reactions?: Record<string, ReactionLine[]> } | null;

    const reactions =
      parsed?.reactions && typeof parsed.reactions === 'object'
        ? { ...defaultReactions, ...parsed.reactions }
        : defaultReactions;

    const episodeDraft = assembleActDrafts(body.scriptSkeleton, reactions);
    return Response.json({ episodeDraft: sanitizeVisibleActDrafts(episodeDraft) });
  } catch (error) {
    console.error('Draft error:', error);
    const episodeDraft = assembleActDrafts(body.scriptSkeleton, defaultReactions);
    return Response.json({ episodeDraft: sanitizeVisibleActDrafts(episodeDraft) });
  }
}
