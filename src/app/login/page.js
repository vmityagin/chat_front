'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiLogin } from '../../lib/apiClient';
import '../../blocks/auth-form/auth-form.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setSubmitting(true);
    try {
      await apiLogin({ email: email.trim(), password });
      router.push('/');
    } catch {
      // ошибка уже показана через тост
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-form">
      <h1 className="auth-form__title">Войти в чат</h1>
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

        <label className="auth-form__label" htmlFor="password">Пароль</label>
        <input
          className="auth-form__input"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <button
          className="auth-form__submit"
          type="submit"
          disabled={submitting || !email.trim() || !password}
        >
          {submitting ? 'Вход...' : 'Войти'}
        </button>
      </form>
      <p className="auth-form__link">
        Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
      </p>
    </main>
  );
}
