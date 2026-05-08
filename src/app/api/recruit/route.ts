import { callAI } from '@/lib/ai';
import { RecruitRequest } from '@/lib/gameTypes';
import { mockRecruit } from '@/lib/mockAI';
import { buildRecruitPrompt } from '@/lib/prompts';

export async function POST(request: Request) {
  const body = (await request.json()) as RecruitRequest;

  if (!process.env.AI_API_KEY) {
    return Response.json(mockRecruit(body));
  }

  try {
    const prompt = buildRecruitPrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.75, 2600);
    return Response.json(result.parsed || mockRecruit(body));
  } catch (error) {
    console.error('Recruit error:', error);
    return Response.json(mockRecruit(body));
  }
}
