// AI 调用封装 — 兼容 OpenAI 格式的 API 调用

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  parsed: Record<string, unknown> | null;
}

function parseJsonObject(content: string): Record<string, unknown> | null {
  try {
    return JSON.parse(content);
  } catch {
    // Continue to more permissive extraction below.
  }

  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1].trim());
    } catch {
      // Continue to balanced object extraction below.
    }
  }

  const firstBrace = content.indexOf('{');
  if (firstBrace < 0) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = firstBrace; i < content.length; i += 1) {
    const char = content[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
    } else if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(content.slice(firstBrace, i + 1));
        } catch {
          return null;
        }
      }
    }
  }

  return null;
}

export async function callAI(
  systemPrompt: string,
  userPrompt: string,
  history: ChatMessage[] = [],
  temperature = 0.85,
  maxTokens = 2000,
  timeoutMs = 45000
): Promise<AIResponse> {
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL || 'https://api.minimax.chat/v1';
  const model = process.env.AI_MODEL || 'MiniMax-M2.7';

  if (!apiKey) {
    throw new Error('AI_API_KEY not configured');
  }

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userPrompt },
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  const parsed = parseJsonObject(content);

  return { content, parsed };
}
