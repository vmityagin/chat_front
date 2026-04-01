const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// ── Токены ──────────────────────────────────────

const ACCESS_KEY = 'auth_access_token';
const REFRESH_KEY = 'auth_refresh_token';
const USER_KEY = 'chat_user';

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(accessToken, refreshToken) {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ── Аватарки ────────────────────────────────────

export function getAvatarImageUrl(avatarId) {
  if (!avatarId) return '';
  return `${API_URL}/avatars/${avatarId}.png`;
}

// ── Глобальный обработчик ошибок ────────────────

let _onError = null;

export function registerErrorHandler(fn) {
  _onError = fn;
}

// ── Fetch с JWT ─────────────────────────────────

let _refreshPromise = null;

async function refreshTokens() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error('Refresh failed');
  }

  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

export async function apiFetch(path, options = {}) {
  const { body, headers: customHeaders, ...rest } = options;

  const headers = { 'Content-Type': 'application/json', ...customHeaders };
  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Auto-refresh при token_expired
  if (res.status === 401) {
    const errData = await res.json().catch(() => ({}));

    if (errData.code === 'token_expired' && getRefreshToken()) {
      try {
        if (!_refreshPromise) {
          _refreshPromise = refreshTokens().finally(() => { _refreshPromise = null; });
        }
        const newToken = await _refreshPromise;

        headers['Authorization'] = `Bearer ${newToken}`;
        res = await fetch(`${API_URL}${path}`, {
          ...rest,
          headers,
          body: body !== undefined ? JSON.stringify(body) : undefined,
        });
      } catch {
        clearTokens();
        if (typeof window !== 'undefined') window.location.href = '/login';
        throw Object.assign(new Error('Сессия истекла'), { code: 'session_expired', status: 401 });
      }
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const msg = data.message || `Ошибка ${res.status}`;
      _onError?.(msg, data.code);
      throw Object.assign(new Error(msg), { code: data.code, status: res.status });
    }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data.message || `Ошибка ${res.status}`;
    _onError?.(msg, data.code);
    throw Object.assign(new Error(msg), { code: data.code, status: res.status });
  }

  return res.json();
}

// ── Auth API ────────────────────────────────────

export async function apiRegister({ email, password, nickname, avatarId }) {
  const data = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: { email, password, nickname, avatarId },
  });
  setTokens(data.accessToken, data.refreshToken);
  const user = { _id: data._id, email: data.email, nickname: data.nickname, avatarId: data.avatarId };
  setStoredUser(user);
  return user;
}

export async function apiLogin({ email, password }) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  setTokens(data.accessToken, data.refreshToken);
  const user = { _id: data._id, email: data.email, nickname: data.nickname, avatarId: data.avatarId };
  setStoredUser(user);
  return user;
}

export async function apiLogout() {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST', body: { refreshToken } });
    } catch {
      // Игнорируем — всё равно чистим токены
    }
  }
  clearTokens();
}
