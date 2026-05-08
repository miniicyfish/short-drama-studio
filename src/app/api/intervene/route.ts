import { callAI } from '@/lib/ai';
import { InterventionRequest } from '@/lib/gameTypes';
import { mockIntervention } from '@/lib/mockAI';
import { buildInterventionPrompt } from '@/lib/prompts';
import { sanitizeVisibleIntervention } from '@/lib/visibleText';

export async function POST(request: Request) {
  const body = (await request.json()) as InterventionRequest;

  if (!process.env.AI_API_KEY) {
    return Response.json(sanitizeVisibleIntervention(mockIntervention(body), body.currentLine));
  }

  try {
    const prompt = buildInterventionPrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.85, 3000, 18000);
    return Response.json(
      sanitizeVisibleIntervention(
        (result.parsed as ReturnType<typeof mockIntervention> | null) || mockIntervention(body),
        body.currentLine
      )
    );
  } catch (error) {
    console.error('Intervention error:', error);
    return Response.json(sanitizeVisibleIntervention(mockIntervention(body), body.currentLine));
  }
}
