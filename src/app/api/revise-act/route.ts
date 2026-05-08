import { callAI } from '@/lib/ai';
import { ReviseActRequest } from '@/lib/gameTypes';
import { mockReviseAct } from '@/lib/mockAI';
import { buildReviseActPrompt } from '@/lib/prompts';
import { sanitizeVisibleActDrafts } from '@/lib/visibleText';

export async function POST(request: Request) {
  const body = (await request.json()) as ReviseActRequest;

  if (!process.env.AI_API_KEY) {
    const fallback = mockReviseAct(body);
    return Response.json({ ...fallback, revisedAct: sanitizeVisibleActDrafts([fallback.revisedAct])[0] });
  }

  try {
    const prompt = buildReviseActPrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.82, 8000, 35000);
    const fallback = mockReviseAct(body);
    const parsed = result.parsed as { revisedAct?: unknown } | null;
    const response =
      parsed && parsed.revisedAct
        ? { ...parsed, revisedAct: sanitizeVisibleActDrafts([parsed.revisedAct as typeof fallback.revisedAct])[0] }
        : { ...fallback, revisedAct: sanitizeVisibleActDrafts([fallback.revisedAct])[0] };
    return Response.json(response);
  } catch (error) {
    console.error('Revise act error:', error);
    const fallback = mockReviseAct(body);
    return Response.json({ ...fallback, revisedAct: sanitizeVisibleActDrafts([fallback.revisedAct])[0] });
  }
}
