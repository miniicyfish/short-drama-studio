import { callAI } from '@/lib/ai';
import { RecruitRequest, RecruitResult } from '@/lib/gameTypes';
import { mockRecruit } from '@/lib/mockAI';
import { buildRecruitPrompt } from '@/lib/prompts';

export const maxDuration = 120;

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
  const startedAt = Date.now();
  const body = (await request.json()) as RecruitRequest;

  if (!process.env.AI_API_KEY) {
    console.warn('[ai-debug]', JSON.stringify({
      route: 'recruit',
      source: 'fallback:no-key',
      durationMs: Date.now() - startedAt,
    }));
    return Response.json(
      normalizeRecruitResponse(mockRecruit(body)),
      { headers: { 'x-ai-source': 'fallback:no-key' } }
    );
  }

  try {
    const prompt = buildRecruitPrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.75, 2600, 90000);
    const source = isRecruitResponse(result.parsed) ? 'ai' : 'fallback:parse-null';
    console.info('[ai-debug]', JSON.stringify({
      route: 'recruit',
      source,
      durationMs: Date.now() - startedAt,
      contentLength: result.content.length,
    }));
    return Response.json(
      normalizeRecruitResponse(isRecruitResponse(result.parsed) ? result.parsed : mockRecruit(body)),
      { headers: { 'x-ai-source': source } }
    );
  } catch (error) {
    console.error('Recruit error:', error);
    console.warn('[ai-debug]', JSON.stringify({
      route: 'recruit',
      source: 'fallback:error',
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : 'unknown error',
    }));
    return Response.json(
      normalizeRecruitResponse(mockRecruit(body)),
      { headers: { 'x-ai-source': 'fallback:error' } }
    );
  }
}
