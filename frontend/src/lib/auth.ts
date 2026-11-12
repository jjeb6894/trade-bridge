import { apiFetch } from './api';
import type { AuthResponse, User } from '../types';

export async function register(email: string, password: string, name: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  storeTokens(data);
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  storeTokens(data);
  return data;
}

export async function fetchCurrentUser(): Promise<User> {
  return apiFetch<User>('/api/user/me');
}

export async function updateUser(data: { name?: string; email?: string }): Promise<User> {
  return apiFetch<User>('/api/user/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function storeTokens(data: AuthResponse): void {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('user', JSON.stringify(data.user));
}

export function clearTokens(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
