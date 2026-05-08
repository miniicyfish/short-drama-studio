import { callAI } from '@/lib/ai';
import { InterventionRequest } from '@/lib/gameTypes';
import { mockIntervention } from '@/lib/mockAI';
import { buildInterventionPrompt } from '@/lib/prompts';

export async function POST(request: Request) {
  const body = (await request.json()) as InterventionRequest;

  if (!process.env.AI_API_KEY) {
    return Response.json(mockIntervention(body));
  }

  try {
    const prompt = buildInterventionPrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.85, 3000, 18000);
    return Response.json(result.parsed || mockIntervention(body));
  } catch (error) {
    console.error('Intervention error:', error);
    return Response.json(mockIntervention(body));
  }
}
