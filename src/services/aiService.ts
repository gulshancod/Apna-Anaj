import { apiFetch } from '../lib/api';

export interface AssistantResponse {
  answer: string;
  page: string;
  language: string;
  provider?: string;
}

export async function askAssistant(
  message: string,
  page: string,
  language: string
): Promise<AssistantResponse> {
  const response = await apiFetch(
    '/api/ai-assistant',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, page, language })
    },
    30000
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result?.success || !result?.answer) {
    throw new Error(
      result?.message ||
      `AI assistant request failed (${response.status}).`
    );
  }

  return {
    answer: String(result.answer),
    page: String(result.page || page),
    language: String(result.language || language),
    provider: result.provider ? String(result.provider) : undefined
  };
}

export async function getAssistantHealth(): Promise<{
  configured: boolean;
  provider: string;
}> {
  const response = await apiFetch('/api/ai-assistant/health', {}, 10000);
  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || 'AI assistant health check failed.');
  }

  return {
    configured: Boolean(result.configured),
    provider: String(result.provider || 'unknown')
  };
}
