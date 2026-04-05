'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TopicList from './TopicList';
import MessageList from './MessageList';
import TopicFiles from './TopicFiles';
import { getAvatarImageUrl, apiFetch, getStoredUser, setStoredUser, apiLogout } from '../lib/apiClient';
import { disconnectSocket } from '../hooks/useSocket';

export default function ChatApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeView, setActiveView] = useState('chat');
  const router = useRouter();

  useEffect(() => {
    const cached = getStoredUser();
    if (cached) setUser(cached);

    apiFetch('/api/users/me')
      .then((data) => {
        const u = { _id: data._id, email: data.email, nickname: data.nickname, avatarId: data.avatarId, role: data.role };
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

  function handleSelectTopic(topic) {
    setActiveTopic(topic);
    setActiveView('chat');
  }

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
          {user.role === 'admin' && (
            <Link href="/admin" className="layout__admin-link">Админка</Link>
          )}
          <button className="layout__logout" type="button" onClick={handleLogout}>
            Выйти
          </button>
        </div>
        <TopicList activeTopic={activeTopic} onSelectTopic={handleSelectTopic} user={user} />
      </aside>
      <main className="layout__main">
        {activeTopic && (
          <div className="layout__topic-header">
            <span className="layout__topic-title">{activeTopic.title}</span>
            <button
              className={`layout__files-tab${activeView === 'files' ? ' layout__files-tab_active' : ''}`}
              type="button"
              onClick={() => setActiveView(activeView === 'files' ? 'chat' : 'files')}
            >
              📎 Файлы
            </button>
          </div>
        )}
        {activeTopic && activeView === 'files' ? (
          <TopicFiles topic={activeTopic} onBack={() => setActiveView('chat')} />
        ) : activeTopic ? (
          <MessageList topic={activeTopic} user={user} />
        ) : (
          <p className="layout__placeholder">Выберите топик</p>
        )}
      </main>
    </div>
  );
}
