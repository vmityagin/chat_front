'use client';

import React, { useState, useEffect } from 'react';
import TopicCard from './TopicCard';
import CreateTopicForm from './CreateTopicForm';
import { apiFetch } from '../lib/apiClient';

export default function TopicList({ activeTopic, onSelectTopic, user }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    apiFetch('/api/topics')
      .then((data) => setTopics(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleTopicCreated(newTopic) {
    setTopics((prev) => [newTopic, ...prev]);
    setShowForm(false);
    onSelectTopic(newTopic);
  }

  function handleTopicDeleted(topicId) {
    setTopics((prev) => prev.filter((t) => t._id !== topicId));
    if (activeTopic?._id === topicId) {
      onSelectTopic(null);
    }
  }

  function handleTopicPinned(updatedTopic) {
    setTopics((prev) => {
      const updated = prev.map((t) => {
        if (t._id === updatedTopic._id) return updatedTopic;
        // Singleton: если новый топик закреплён — снять пин с остальных
        if (updatedTopic.isPinned && t.isPinned) return { ...t, isPinned: false };
        return t;
      });
      // Пересортировать: pinned первыми
      return updated.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
        return 0;
      });
    });
  }

  return (
    <div className="topic-list__wrapper">
      <div className="topic-list__toolbar">
        {!showForm && (
          <button
            className="topic-list__create-btn"
            type="button"
            onClick={() => setShowForm(true)}
          >
            + Новый топик
          </button>
        )}
      </div>

      {showForm && (
        <CreateTopicForm
          onCreated={handleTopicCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading && <p className="topic-list__loading">Загрузка топиков...</p>}

      {!loading && topics.length === 0 && !showForm && (
        <p className="topic-list__empty">Топиков пока нет</p>
      )}

      {!loading && topics.length > 0 && (
        <ul className="topic-list">
          {topics.map((topic) => (
            <li key={topic._id} className="topic-list__item">
              <TopicCard
                topic={topic}
                isActive={activeTopic?._id === topic._id}
                onSelect={onSelectTopic}
                currentUserId={user?._id}
                onDelete={handleTopicDeleted}
                onPin={handleTopicPinned}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
