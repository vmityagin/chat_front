'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopicList from './TopicList';
import MessageList from './MessageList';
import { getAvatarImageUrl, apiFetch, getStoredUser, setStoredUser, apiLogout } from '../lib/apiClient';
import { disconnectSocket } from '../hooks/useSocket';

export default function ChatApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cached = getStoredUser();
    if (cached) setUser(cached);

    apiFetch('/api/users/me')
      .then((data) => {
        const u = { _id: data._id, email: data.email, nickname: data.nickname, avatarId: data.avatarId };
        setStoredUser(u);
        setUser(u);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    disconnectSocket();
    await apiLogout();
    router.push('/login');
  }

  if (loading && !user) {
    return <p className="page__loading">Загрузка...</p>;
  }

  if (!user) return null;

  return (
    <div className="layout">
      <aside className="layout__sidebar">
        <div className="layout__user">
          <img
            className="layout__user-avatar"
            src={getAvatarImageUrl(user.avatarId)}
            alt={user.nickname}
            width={32}
            height={32}
          />
          <span className="layout__user-name">{user.nickname}</span>
          <button className="layout__logout" type="button" onClick={handleLogout}>
            Выйти
          </button>
        </div>
        <TopicList activeTopic={activeTopic} onSelectTopic={setActiveTopic} user={user} />
      </aside>
      <main className="layout__main">
        {activeTopic ? (
          <MessageList topic={activeTopic} user={user} />
        ) : (
          <p className="layout__placeholder">Выберите топик</p>
        )}
      </main>
    </div>
  );
}
