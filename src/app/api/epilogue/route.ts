import { callAI } from '@/lib/ai';
import { EpilogueRequest } from '@/lib/gameTypes';
import { mockEpilogue } from '@/lib/mockAI';
import { buildEpiloguePrompt } from '@/lib/prompts';

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = (await request.json()) as EpilogueRequest;

  if (!process.env.AI_API_KEY) {
    return Response.json(mockEpilogue(body));
  }

  try {
    const prompt = buildEpiloguePrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.8, 1800, 45000);
    return Response.json(result.parsed || mockEpilogue(body));
  } catch (error) {
    console.error('Epilogue error:', error);
    return Response.json(mockEpilogue(body));
  }
}
