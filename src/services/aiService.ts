import { apiFetch } from '../lib/api';

export async function askAssistant(message: string, page: string, language: string): Promise<string> {
  const response = await apiFetch('/api/ai-assistant', {
    method: 'POST',
    body: JSON.stringify({ message, page, language })
  }, 30000);
  const result = await response.json();
  if (!response.ok || !result?.success || !result?.answer) {
    throw new Error(result?.message || 'AI assistant is temporarily unavailable.');
  }
  return String(result.answer);
}
