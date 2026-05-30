// Backend API bilan ishlash uchun asosiy klient.
// Javob formati: { status, message, data } — biz data ni qaytaramiz.

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

const SESSION_KEY = 'orderix_session';

export function getSession() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setSession(session) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {}
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

export function getAccessToken() {
  return getSession()?.access || null;
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function rawRequest(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const opts = { method, headers: { ...headers } };
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  if (auth) {
    const token = getAccessToken();
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, opts);
  let payload = null;
  try {
    payload = await res.json();
  } catch {}
  return { res, payload };
}

// access token muddati tugaganda refresh qilib ko'radi
async function tryRefresh() {
  const session = getSession();
  if (!session?.refresh) return false;
  const { res, payload } = await rawRequest('/auth/refresh', {
    method: 'POST',
    body: { refresh: session.refresh },
    auth: false,
  });
  if (res.ok && payload?.access) {
    setSession({ ...session, access: payload.access });
    return true;
  }
  return false;
}

export async function apiRequest(path, options = {}) {
  let { res, payload } = await rawRequest(path, options);

  if (res.status === 401 && options.auth !== false) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      ({ res, payload } = await rawRequest(path, options));
    }
  }

  if (!res.ok) {
    const message =
      (payload && (payload.message || payload.detail)) || 'So\'rovda xatolik yuz berdi';
    throw new ApiError(message, res.status, payload?.data ?? payload);
  }

  // Wrapper { status, message, data } bo'lsa data ni qaytaramiz
  if (payload && typeof payload === 'object' && 'data' in payload && 'status' in payload) {
    return payload.data;
  }
  return payload;
}

export const api = {
  get: (path, opts) => apiRequest(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => apiRequest(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => apiRequest(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => apiRequest(path, { ...opts, method: 'PATCH', body }),
  del: (path, opts) => apiRequest(path, { ...opts, method: 'DELETE' }),
};
