const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/** URL файла аватарки (как в chat_server: express.static на /avatars, расширение .png) */
export function getAvatarImageUrl(avatarId) {
  if (!avatarId) return '';
  return `${API_URL}/avatars/${avatarId}.png`;
}

let _onError = null;

export function registerErrorHandler(fn) {
  _onError = fn;
}

export async function apiFetch(path, options = {}) {
  const { body, ...rest } = options;

  const res = await fetch(API_URL + path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data.message || `Ошибка ${res.status}`;
    _onError?.(msg, data.code);
    throw Object.assign(new Error(msg), { code: data.code, status: res.status });
  }

  return res.json();
}
