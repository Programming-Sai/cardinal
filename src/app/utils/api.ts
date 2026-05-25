type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
  code?: string;
};

export const AUTH_TOKEN_KEY = 'cardinal_auth_token';
export const AUTH_ADMIN_KEY = 'cardinal_current_admin';

const rawApiBase = import.meta.env.VITE_API_BASE_URL?.trim() || '/api';
const apiBase = rawApiBase.endsWith('/') ? rawApiBase.slice(0, -1) : rawApiBase;

const readStorage = (storage: Storage, key: string) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (storage: Storage, key: string, value: string) => {
  try {
    storage.setItem(key, value);
  } catch {
    // noop
  }
};

const removeStorage = (storage: Storage, key: string) => {
  try {
    storage.removeItem(key);
  } catch {
    // noop
  }
};

export const getStoredToken = () => readStorage(window.sessionStorage, AUTH_TOKEN_KEY);
export const setStoredToken = (token: string) => writeStorage(window.sessionStorage, AUTH_TOKEN_KEY, token);
export const clearStoredToken = () => removeStorage(window.sessionStorage, AUTH_TOKEN_KEY);

export const getStoredAdmin = <T = unknown>() => {
  const raw = readStorage(window.sessionStorage, AUTH_ADMIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const setStoredAdmin = (admin: unknown) => {
  writeStorage(window.sessionStorage, AUTH_ADMIN_KEY, JSON.stringify(admin));
};

export const clearStoredAdmin = () => removeStorage(window.sessionStorage, AUTH_ADMIN_KEY);

export const clearAuth = () => {
  clearStoredToken();
  clearStoredAdmin();
};

const authHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = getStoredToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  const payload = isJson ? ((await response.json()) as ApiResponse<T>) : await response.text();

  if (!response.ok) {
    const message =
      isJson && typeof payload === 'object' && payload && 'error' in payload
        ? payload.error
        : response.statusText || 'Request failed';
    throw new Error(message);
  }

  if (isJson && typeof payload === 'object' && payload && 'success' in payload) {
    return payload.data;
  }

  return payload as T;
};

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  return handleResponse<T>(response);
};

export const apiDownload = async (path: string) => {
  const response = await fetch(`${apiBase}${path}`, {
    cache: 'no-store',
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(response.statusText || 'Request failed');
  }

  return response.text();
};
