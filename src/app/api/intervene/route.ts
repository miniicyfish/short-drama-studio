import { callAI } from '@/lib/ai';
import { InterventionRequest } from '@/lib/gameTypes';
import { mockIntervention } from '@/lib/mockAI';
import { buildInterventionPrompt } from '@/lib/prompts';
import { sanitizeVisibleIntervention } from '@/lib/visibleText';

export const maxDuration = 120;

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
  const startedAt = Date.now();
  const body = (await request.json()) as InterventionRequest;

  if (!process.env.AI_API_KEY) {
    console.warn('[ai-debug]', JSON.stringify({
      route: 'intervene',
      source: 'fallback:no-key',
      toolType: body.toolType,
      actId: body.actId,
      durationMs: Date.now() - startedAt,
    }));
    return Response.json(
      sanitizeVisibleIntervention(normalizeRewriteResult(body, mockIntervention(body)), body.currentLine),
      { headers: { 'x-ai-source': 'fallback:no-key' } }
    );
  }

  try {
    const prompt = buildInterventionPrompt(body);
    const result = await callAI(prompt.system, prompt.user, [], 0.85, 3000, 90000);
    const response = (result.parsed as ReturnType<typeof mockIntervention> | null) || mockIntervention(body);
    const normalizedResponse = normalizeRewriteResult(body, response);
    const source =
      result.parsed && normalizedResponse.immediate === response.immediate
        ? 'ai'
        : result.parsed
          ? 'ai:normalized-rewrite'
          : 'fallback:parse-null';
    console.info('[ai-debug]', JSON.stringify({
      route: 'intervene',
      source,
      toolType: body.toolType,
      actId: body.actId,
      durationMs: Date.now() - startedAt,
      contentLength: result.content.length,
    }));
    return Response.json(
      sanitizeVisibleIntervention(
        normalizedResponse,
        body.currentLine
      ),
      { headers: { 'x-ai-source': source } }
    );
  } catch (error) {
    console.error('Intervention error:', error);
    console.warn('[ai-debug]', JSON.stringify({
      route: 'intervene',
      source: 'fallback:error',
      toolType: body.toolType,
      actId: body.actId,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : 'unknown error',
    }));
    return Response.json(
      sanitizeVisibleIntervention(normalizeRewriteResult(body, mockIntervention(body)), body.currentLine),
      { headers: { 'x-ai-source': 'fallback:error' } }
    );
  }
}
