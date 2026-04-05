import React from 'react';
import { getAvatarImageUrl, apiFetch } from '../lib/apiClient';

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export default function MessageItem({ message, currentUserId, isAdmin, onDelete, onReply }) {
  const isOwn = message.owner?._id === currentUserId;
  const canDelete = isOwn || isAdmin;

  async function handleDelete() {
    try {
      await apiFetch(`/api/messages/${message._id}`, { method: 'DELETE' });
      onDelete(message._id);
    } catch {
      // ошибка уже в тосте
    }
  }

  return (
    <li className={'message-item' + (isOwn ? ' message-item_own' : '')}>
      <img
        className="message-item__avatar"
        src={getAvatarImageUrl(message.owner?.avatarId)}
        alt={message.owner?.nickname || '?'}
        width={32}
        height={32}
      />
      <div className="message-item__body">
        <span className="message-item__author">{message.owner?.nickname || 'Аноним'}</span>
        <span className="message-item__time">{formatTime(message.serverTimestamp)}</span>
        {message.replyTo && !message.replyTo.isDeleted && (
          <div className="message-item__reply">
            <span className="message-item__reply-author">{message.replyTo.owner?.nickname}</span>
            <p className="message-item__reply-text">{message.replyTo.text}</p>
          </div>
        )}
        <p className="message-item__text">{message.text}</p>
      </div>
      <button
        className="message-item__reply-btn"
        type="button"
        onClick={() => onReply?.(message)}
        aria-label="Ответить"
      >
        ↩
      </button>
      {canDelete && (
        <button
          className="message-item__delete"
          type="button"
          onClick={handleDelete}
          aria-label="Удалить сообщение"
        >
          ✕
        </button>
      )}
    </li>
  );
}
