import React from 'react';
import { apiFetch } from '../lib/apiClient';

export default function TopicCard({ topic, isActive, onSelect, isAdmin, onDelete, onPin }) {

  async function handleDelete(e) {
    e.stopPropagation();
    try {
      await apiFetch(`/api/topics/${topic._id}`, { method: 'DELETE' });
      onDelete(topic._id);
    } catch {
      // ошибка уже в тосте
    }
  }

  async function handlePin(e) {
    e.stopPropagation();
    try {
      const updated = await apiFetch(`/api/topics/${topic._id}`, {
        method: 'PATCH',
        body: { isPinned: !topic.isPinned },
      });
      onPin(updated);
    } catch {
      // ошибка уже в тосте
    }
  }

  return (
    <div
      className={
        'topic-card' +
        (topic.isPinned ? ' topic-card_pinned' : '') +
        (topic.isClosed ? ' topic-card_closed' : '') +
        (isActive ? ' topic-card_active' : '')
      }
      onClick={() => onSelect(topic)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(topic)}
    >
      <div className="topic-card__content">
        <span className="topic-card__title">
          {topic.isPinned && <span className="topic-card__pin">📌 </span>}
          {topic.title}
          {topic.isClosed && <span className="topic-card__closed-badge"> [закрыт]</span>}
        </span>
        {topic.description && (
          <span className="topic-card__description">{topic.description}</span>
        )}
        <span className="topic-card__meta">{topic.messageCount} сообщ.</span>
      </div>
      {isAdmin && (
        <div className="topic-card__actions">
          <button
            className={'topic-card__pin-btn' + (topic.isPinned ? ' topic-card__pin-btn_active' : '')}
            type="button"
            onClick={handlePin}
            aria-label={topic.isPinned ? 'Открепить топик' : 'Закрепить топик'}
            title={topic.isPinned ? 'Открепить' : 'Закрепить'}
          >
            📌
          </button>
          <button
            className="topic-card__delete"
            type="button"
            onClick={handleDelete}
            aria-label="Удалить топик"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
