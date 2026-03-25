'use client';

import React, { useState, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useToast } from './ToastProvider';

const MAX_LENGTH = 2000;

export default function MessageInput({ topic }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const socket = useSocket();
  const { showError } = useToast();
  const inputRef = useRef(null);

  const isClosed = topic.isClosed;
  const canSend = text.trim().length > 0 && text.length <= MAX_LENGTH && !isClosed && !sending;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSend) return;

    const trimmed = text.trim();
    setSending(true);

    socket.emit(
      'send_message',
      {
        text: trimmed,
        topicId: topic._id,
        clientTimestamp: new Date().toISOString(),
      },
      (ack) => {
        setSending(false);
        if (ack?.error) {
          showError(ack.error.message, ack.error.code);
        } else {
          setText('');
          inputRef.current?.focus();
        }
      }
    );
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      {isClosed && (
        <p className="message-input__notice">Топик закрыт — отправка недоступна</p>
      )}
      <div className="message-input__row">
        <textarea
          className="message-input__textarea"
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isClosed ? 'Топик закрыт' : 'Сообщение... (Enter — отправить, Shift+Enter — перенос)'}
          maxLength={MAX_LENGTH}
          rows={2}
          disabled={isClosed}
        />
        <button
          className="message-input__send"
          type="submit"
          disabled={!canSend}
        >
          {sending ? '...' : 'Отправить'}
        </button>
      </div>
      {text.length > MAX_LENGTH * 0.9 && (
        <p className="message-input__counter">
          {text.length} / {MAX_LENGTH}
        </p>
      )}
    </form>
  );
}
