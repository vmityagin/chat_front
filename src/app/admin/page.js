'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, getAccessToken, getStoredUser } from '../../lib/apiClient';
import '../../blocks/admin-page/admin-page.css';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace('/login');
      return;
    }
    const stored = getStoredUser();
    if (stored?.role !== 'admin') {
      router.replace('/');
      return;
    }

    apiFetch('/api/users/all')
      .then((data) => setUsers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  async function handleToggleRole(user) {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      const updated = await apiFetch(`/api/users/${user._id}/role`, {
        method: 'PATCH',
        body: { role: newRole },
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === updated._id ? { ...u, role: updated.role } : u)),
      );
    } catch {
      // ошибка уже в тосте
    }
  }

  const currentUser = getStoredUser();
  const isSuperAdmin = (email) =>
    email?.toLowerCase() === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com').toLowerCase();

  if (loading) return <p className="admin-page__loading">Загрузка...</p>;

  return (
    <main className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Управление пользователями</h1>
        <Link href="/" className="admin-page__back">← Назад в чат</Link>
      </div>

      <table className="admin-page__table">
        <thead>
          <tr>
            <th>Никнейм</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Регистрация</th>
            <th>Админ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user._id === currentUser?._id;
            const isProtected = isSuperAdmin(user.email);
            return (
              <tr key={user._id}>
                <td>{user.nickname}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={user.role === 'admin'}
                    disabled={isProtected || isSelf}
                    onChange={() => handleToggleRole(user)}
                    title={
                      isProtected ? 'Суперадмин защищён' :
                      isSelf ? 'Нельзя менять свою роль' :
                      user.role === 'admin' ? 'Снять админа' : 'Назначить админом'
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
