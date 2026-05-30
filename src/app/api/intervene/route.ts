import { callAI } from '@/lib/ai';
import { InterventionRequest } from '@/lib/gameTypes';
import { mockIntervention } from '@/lib/mockAI';
import { buildInterventionPrompt } from '@/lib/prompts';
import { sanitizeVisibleIntervention } from '@/lib/visibleText';

export const maxDuration = 60;

function normalizeRewriteResult(
  body: InterventionRequest,
  response: ReturnType<typeof mockIntervention>
) {
  if (body.toolType !== 'rewrite') return response;
  const text = response.immediate.replacementCurrentLine.text;
  if (response.immediate.replacementCurrentLine.speaker === '你' && !/导演把|改成了更贴近|工具改写|selectedText/.test(text)) {
    return response;
  }
  const fallback = mockIntervention(body);
  return {
    ...response,
    immediate: fallback.immediate,
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as InterventionRequest;

  if (!process.env.AI_API_KEY) {
    return Response.json(sanitizeVisibleIntervention(normalizeRewriteResult(body, mockIntervention(body)), body.currentLine));
  }

  try {
    const prompt = buildInterventionPrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.85, 3000, 45000);
    const response = (result.parsed as ReturnType<typeof mockIntervention> | null) || mockIntervention(body);
    return Response.json(
      sanitizeVisibleIntervention(
        normalizeRewriteResult(body, response),
        body.currentLine
      )
    );
  } catch (error) {
    console.error('Intervention error:', error);
    return Response.json(sanitizeVisibleIntervention(normalizeRewriteResult(body, mockIntervention(body)), body.currentLine));
  }
}
