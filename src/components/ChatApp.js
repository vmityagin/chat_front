'use client';

import React, { useState, useEffect } from 'react';
import RegisterForm from './RegisterForm';
import TopicList from './TopicList';
import MessageList from './MessageList';
import { getAvatarImageUrl } from '../lib/apiClient';

export default function ChatApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('chat_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  function handleRegistered(userData) {
    localStorage.setItem('chat_user', JSON.stringify(userData));
    setUser(userData);
  }

  if (loading) {
    return <p className="page__loading">Загрузка...</p>;
  }

  if (!user) {
    return <RegisterForm onRegistered={handleRegistered} />;
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
