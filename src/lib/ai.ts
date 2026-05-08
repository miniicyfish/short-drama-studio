// AI 调用封装 — 兼容 OpenAI 格式的 API 调用

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  parsed: Record<string, unknown> | null;
}

export async function callAI(
  systemPrompt: string,
  userPrompt: string,
  history: ChatMessage[] = [],
  temperature = 0.85,
  maxTokens = 2000,
  timeoutMs = 15000
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

  // 尝试从返回内容中解析 JSON
  let parsed: Record<string, unknown> | null = null;
  try {
    // 尝试直接解析
    parsed = JSON.parse(content);
  } catch {
    // 尝试从 markdown code block 中提取
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[1].trim());
      } catch {
        // 解析失败，保持 null
      }
    }
  }

  return { content, parsed };
}
