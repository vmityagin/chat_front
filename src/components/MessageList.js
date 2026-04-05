'use client';

import React, { useState, useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import { apiFetch } from '../lib/apiClient';
import { useSocket } from '../hooks/useSocket';

const LIMIT = 20;

export default function MessageList({ topic, user }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const bottomRef = useRef(null);
  const isFirstLoad = useRef(true);
  const socket = useSocket();

  // Join topic через сокет при смене топика
  useEffect(() => {
    socket.emit('join_topic', { topicId: topic._id }, (ack) => {
      if (ack?.error) {
        console.error('[socket] join_topic error:', ack.error.message);
      }
    });
  }, [topic._id, socket]);

  // Слушаем new_message
  useEffect(() => {
    function handleNewMessage(message) {
      if (message.topicId?.toString() !== topic._id) return;
      setMessages((prev) => {
        // Избегаем дублей (сервер шлёт всем, включая отправителя)
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [topic._id, socket]);

  // Сбрасываем и грузим историю при смене топика
  useEffect(() => {
    setMessages([]);
    setHasMore(false);
    setReplyTo(null);
    isFirstLoad.current = true;
    loadMessages(null, true);
  }, [topic._id]);

  // Скролл вниз при первой загрузке
  useEffect(() => {
    if (isFirstLoad.current && messages.length > 0) {
      bottomRef.current?.scrollIntoView();
      isFirstLoad.current = false;
    }
  }, [messages]);

  async function loadMessages(before = null, reset = false) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ topicId: topic._id, limit: LIMIT });
      if (before) params.set('before', before);

      const data = await apiFetch(`/api/messages?${params}`);
      // Сервер отдаёт от новых к старым — реверсируем
      const ordered = [...data].reverse();

      setMessages((prev) => (reset ? ordered : [...ordered, ...prev]));
      setHasMore(data.length === LIMIT);
    } catch {
      // ошибка уже в тосте
    } finally {
      setLoading(false);
    }
  }

  function handleLoadMore() {
    if (messages.length === 0) return;
    const oldestId = messages[0]._id;
    loadMessages(oldestId);
  }

  return (
    <div className="message-list">
      <div className="message-list__header">
        <span className="message-list__topic-title">{topic.title}</span>
        {topic.isClosed && <span className="message-list__closed">[закрыт]</span>}
      </div>

      <div className="message-list__scroll">
        {hasMore && (
          <button
            className="message-list__load-more"
            onClick={handleLoadMore}
            disabled={loading}
            type="button"
          >
            {loading ? 'Загрузка...' : 'Загрузить ещё'}
          </button>
        )}

        {messages.length === 0 && !loading && (
          <p className="message-list__empty">Сообщений нет</p>
        )}

        <ul className="message-list__items">
          {messages.map((msg) => (
            <MessageItem
              key={msg._id}
              message={msg}
              currentUserId={user._id}
              isAdmin={user.role === 'admin'}
              onDelete={(id) => setMessages((prev) => prev.filter((m) => m._id !== id))}
              onReply={setReplyTo}
            />
          ))}
        </ul>
        <div ref={bottomRef} />
      </div>
      <MessageInput topic={topic} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} />
    </div>
  );
}
