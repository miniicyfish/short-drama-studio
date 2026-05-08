import { callAI } from '@/lib/ai';
import { DraftRequest } from '@/lib/gameTypes';
import { mockDraft } from '@/lib/mockAI';
import { buildDraftPrompt } from '@/lib/prompts';

export async function POST(request: Request) {
  const body = (await request.json()) as DraftRequest;

  if (!process.env.AI_API_KEY) {
    return Response.json(mockDraft(body));
  }

  try {
    const prompt = buildDraftPrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.85, 22000, 60000);
    return Response.json(result.parsed || mockDraft(body));
  } catch (error) {
    console.error('Draft error:', error);
    return Response.json(mockDraft(body));
  }
}
