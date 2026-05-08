import { callAI } from '@/lib/ai';
import { RecruitRequest, RecruitResult } from '@/lib/gameTypes';
import { mockRecruit } from '@/lib/mockAI';
import { buildRecruitPrompt } from '@/lib/prompts';

function cleanVisibleText(text: string) {
  let value = text.trim();
  const saidIndex = Math.max(value.lastIndexOf('说：'), value.lastIndexOf('说:'));
  if (saidIndex >= 0) value = value.slice(saidIndex + 2).trim();
  for (let i = 0; i < 3; i += 1) {
    value = value
      .replace(/^["“”'‘’]+/, '')
      .replace(/["“”'‘’]+$/, '')
      .trim();
  }
  return value;
}

interface RecruitResponse {
  recruitResults: RecruitResult[];
}

function isRecruitResponse(value: unknown): value is RecruitResponse {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'recruitResults' in value &&
      Array.isArray((value as RecruitResponse).recruitResults)
  );
}

function normalizeRecruitResponse(response: RecruitResponse) {
  return {
    recruitResults: response.recruitResults.map((result) => ({
      ...result,
      actorReply: cleanVisibleText(result.actorReply || ''),
      visibleConversation: (result.visibleConversation || []).map((line) => ({
        ...line,
        text: cleanVisibleText(line.text || ''),
      })),
    })),
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as RecruitRequest;

  if (!process.env.AI_API_KEY) {
    return Response.json(normalizeRecruitResponse(mockRecruit(body)));
  }

  try {
    const prompt = buildRecruitPrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.75, 2600);
    return Response.json(normalizeRecruitResponse(isRecruitResponse(result.parsed) ? result.parsed : mockRecruit(body)));
  } catch (error) {
    console.error('Recruit error:', error);
    return Response.json(normalizeRecruitResponse(mockRecruit(body)));
  }
}
