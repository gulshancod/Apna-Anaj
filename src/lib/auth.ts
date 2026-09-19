import { apiFetch, clearAuthToken, setAuthToken } from './api';

export interface AuthUser {
  id: string;
  role: 'buyer' | 'farmer';
  name: string;
  phone: string;
  email: string;
  farm: string;
  location: string;
  address: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  message?: string;
}

async function readResponse(response: Response): Promise<AuthResponse> {
  const contentType = response.headers.get('content-type') || '';
  let data: AuthResponse | null = null;
  let rawBody = '';

  try {
    if (contentType.includes('application/json')) {
      data = (await response.json()) as AuthResponse;
    } else {
      rawBody = await response.text();
    }
  } catch {
    data = null;
  }

  if (!response.ok || !data?.success) {
    const serverMessage = data?.message?.trim();

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (response.status) {
      throw new Error(
        `Backend request failed (${response.status}). Please check the backend service and try again.`
      );
    }

    if (rawBody.trim()) {
      throw new Error('Backend returned an unexpected response. Please try again.');
    }

    throw new Error('Unable to connect to the backend. Please try again.');
  }

  return data;
}

export async function registerUser(payload: {
  role: 'buyer' | 'farmer';
  name: string;
  phone: string;
  password: string;
  farm?: string;
  location?: string;
  address?: string;
}): Promise<AuthUser> {
  const response = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  const data = await readResponse(response);

  if (!data.token || !data.user) {
    throw new Error('Registration succeeded but no session was returned.');
  }

  setAuthToken(data.token);
  return data.user;
}

export async function loginUser(
  role: 'buyer' | 'farmer',
  identifier: string,
  password: string
): Promise<AuthUser> {
  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ role, identifier, password })
  });

  const data = await readResponse(response);

  if (!data.token || !data.user) {
    throw new Error('Login succeeded but no session was returned.');
  }

  setAuthToken(data.token);
  return data.user;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await apiFetch('/api/auth/me');

  if (response.status === 401) {
    clearAuthToken();
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const data = await response.json().catch(() => null);
  return data?.success && data.user ? data.user : null;
}

export async function logoutUser(): Promise<void> {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST' });
  } finally {
    clearAuthToken();
  }
}
