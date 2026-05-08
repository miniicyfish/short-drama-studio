import { callAI } from '@/lib/ai';
import { ReviseActRequest } from '@/lib/gameTypes';
import { mockReviseAct } from '@/lib/mockAI';
import { buildReviseActPrompt } from '@/lib/prompts';

export async function POST(request: Request) {
  const body = (await request.json()) as ReviseActRequest;

  if (!process.env.AI_API_KEY) {
    return Response.json(mockReviseAct(body));
  }

  try {
    const prompt = buildReviseActPrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.82, 8000, 35000);
    return Response.json(result.parsed || mockReviseAct(body));
  } catch (error) {
    console.error('Revise act error:', error);
    return Response.json(mockReviseAct(body));
  }
}
