'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, apiRegister, getAccessToken } from '../../lib/apiClient';
import '../../blocks/auth-form/auth-form.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatarId, setAvatarId] = useState('');
  const [avatars, setAvatars] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (getAccessToken()) router.replace('/');
  }, [router]);

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
    if (!email.trim() || !password || !nickname.trim() || !avatarId) return;
    setSubmitting(true);
    try {
      await apiRegister({ email: email.trim(), password, nickname: nickname.trim(), avatarId });
      router.push('/');
    } catch {
      // ошибка уже показана через тост
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = email.trim() && password.length >= 8 && nickname.trim().length >= 2 && avatarId;

  return (
    <main className="auth-form">
      <h1 className="auth-form__title">Регистрация</h1>
      <form className="auth-form__form" onSubmit={handleSubmit}>
        <label className="auth-form__label" htmlFor="email">Email</label>
        <input
          className="auth-form__input"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label className="auth-form__label" htmlFor="password">Пароль (мин. 8 символов)</label>
        <input
          className="auth-form__input"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          maxLength={64}
          required
          autoComplete="new-password"
        />

        <label className="auth-form__label" htmlFor="nickname">Никнейм (2–32 символа)</label>
        <input
          className="auth-form__input"
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
          <fieldset className="auth-form__avatars">
            <legend className="auth-form__legend">Аватар</legend>
            {avatars.map((av) => (
              <label key={av.id} className="auth-form__avatar-option">
                <input
                  type="radio"
                  name="avatar"
                  value={av.id}
                  checked={avatarId === av.id}
                  onChange={() => setAvatarId(av.id)}
                />
                <img
                  className="auth-form__avatar-img"
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
          className="auth-form__submit"
          type="submit"
          disabled={submitting || !canSubmit}
        >
          {submitting ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
      <p className="auth-form__link">
        Уже есть аккаунт? <Link href="/login">Войти</Link>
      </p>
    </main>
  );
}
