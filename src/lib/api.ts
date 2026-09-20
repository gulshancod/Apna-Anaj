const DEFAULT_API_BASE_URL = 'https://apna-anaj-backend.onrender.com';

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, '');

const AUTH_TOKEN_KEY = 'apna-anaj-auth-token';

export function getAuthToken(): string | null {
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: init.signal || controller.signal,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function fetchMandiBatchAsIndependentRequests(
  path: string,
  headers: Headers,
  timeoutMs: number
): Promise<Response> {
  const query = path.split('?')[1] || '';
  const crops = Array.from(
    new Set(
      (new URLSearchParams(query).get('crops') || '')
        .split(',')
        .map((crop) => crop.trim())
        .filter(Boolean)
    )
  );

  const data: Record<string, any> = {};
  let nextIndex = 0;
  const worker = async () => {
    while (nextIndex < crops.length) {
      const index = nextIndex++;
      const crop = crops[index];

      try {
        const response = await fetchWithTimeout(
          `${API_BASE_URL}/api/market-summary?crop=${encodeURIComponent(crop)}`,
          { headers },
          Math.min(timeoutMs, 15000)
        );
        const result = await response.json().catch(() => null);

        data[crop] =
          result && typeof result === 'object'
            ? result
            : {
                success: false,
                availableData: false,
                isDemoData: false,
                message: 'Invalid government mandi response',
              };
      } catch (error: any) {
        data[crop] = {
          success: false,
          availableData: false,
          isDemoData: false,
          message: error?.message || 'Government mandi request failed',
        };
      }
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(3, crops.length) }, () => worker())
  );

  return new Response(
    JSON.stringify({
      success: true,
      requested: crops.length,
      data,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
  timeoutMs = 15000
): Promise<Response> {
  const headers = new Headers(init.headers || {});
  const token = getAuthToken();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (path.startsWith('/api/market-summary-batch?crops=')) {
    return fetchMandiBatchAsIndependentRequests(path, headers, timeoutMs);
  }

  return fetchWithTimeout(`${API_BASE_URL}${path}`, { ...init, headers }, timeoutMs);
}
