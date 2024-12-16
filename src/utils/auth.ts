import { AuthState } from '@/shared/types/auth';

const AUTH_KEY = 'flipmentor_auth';

export const saveAuth = (auth: AuthState): void => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
};

export const loadAuth = (): AuthState | null => {
  const saved = localStorage.getItem(AUTH_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const clearAuth = (): void => {
  localStorage.removeItem(AUTH_KEY);
}; 