'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../lib/apiClient';

function getCookieBrowser() {
  const KEY = 'chat_browser_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(KEY, id);
  }
  return id;
}

export default function RegisterForm({ onRegistered }) {
  const [avatars, setAvatars] = useState([]);
  const [nickname, setNickname] = useState('');
  const [avatarId, setAvatarId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch('/api/avatars')
      .then((res) => {
        setAvatars(res.data);
        if (res.data.length > 0) setAvatarId(res.data[0].id);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nickname.trim() || !avatarId) return;
    setSubmitting(true);
    try {
      const user = await apiFetch('/api/users', {
        method: 'POST',
        body: { nickname: nickname.trim(), avatarId, cookieBrowser: getCookieBrowser() },
      });
      onRegistered(user);
    } catch {
      // ошибка уже показана через тост
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="register-form">
      <h1 className="register-form__title">Войти в чат</h1>
      <form className="register-form__form" onSubmit={handleSubmit}>
        <label className="register-form__label" htmlFor="nickname">
          Никнейм (2–32 символа)
        </label>
        <input
          className="register-form__input"
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          minLength={2}
          maxLength={32}
          required
          autoComplete="off"
        />

        {avatars.length > 0 && (
          <fieldset className="register-form__avatars">
            <legend className="register-form__legend">Аватар</legend>
            {avatars.map((av) => (
              <label key={av.id} className="register-form__avatar-option">
                <input
                  type="radio"
                  name="avatar"
                  value={av.id}
                  checked={avatarId === av.id}
                  onChange={() => setAvatarId(av.id)}
                />
                <img
                  className="register-form__avatar-img"
                  src={av.url}
                  alt={av.id}
                  width={48}
                  height={48}
                />
              </label>
            ))}
          </fieldset>
        )}

        <button
          className="register-form__submit"
          type="submit"
          disabled={submitting || !nickname.trim() || !avatarId}
        >
          {submitting ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </main>
  );
}
