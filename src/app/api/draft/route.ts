import { callAI } from '@/lib/ai';
import { DraftRequest } from '@/lib/gameTypes';
import { mockDraft } from '@/lib/mockAI';
import { buildDraftPrompt } from '@/lib/prompts';
import { sanitizeVisibleActDrafts } from '@/lib/visibleText';

export async function POST(request: Request) {
  const body = (await request.json()) as DraftRequest;

  if (!process.env.AI_API_KEY) {
    const fallback = mockDraft(body);
    return Response.json({ ...fallback, episodeDraft: sanitizeVisibleActDrafts(fallback.episodeDraft) });
  }

  try {
    const prompt = buildDraftPrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.85, 22000, 60000);
    const fallback = mockDraft(body);
    const parsed = result.parsed as { episodeDraft?: unknown } | null;
    const response =
      parsed && Array.isArray(parsed.episodeDraft)
        ? { ...parsed, episodeDraft: sanitizeVisibleActDrafts(parsed.episodeDraft as typeof fallback.episodeDraft) }
        : { ...fallback, episodeDraft: sanitizeVisibleActDrafts(fallback.episodeDraft) };
    return Response.json(response);
  } catch (error) {
    console.error('Draft error:', error);
    const fallback = mockDraft(body);
    return Response.json({ ...fallback, episodeDraft: sanitizeVisibleActDrafts(fallback.episodeDraft) });
  }
}
