'use client';

import React, { useState, useRef, useEffect } from 'react';
import { apiFetch } from '../lib/apiClient';

export default function CreateTopicForm({ onCreated, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const body = { title: title.trim() };
      if (description.trim()) body.description = description.trim();
      const topic = await apiFetch('/api/topics', { method: 'POST', body });
      onCreated(topic);
    } catch {
      // ошибка уже в тосте
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="create-topic-form" onSubmit={handleSubmit}>
      <label className="create-topic-form__label" htmlFor="topic-title">
        Название (2–100 символов)
      </label>
      <input
        className="create-topic-form__input"
        id="topic-title"
        ref={titleRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        minLength={2}
        maxLength={100}
        required
        autoComplete="off"
      />

      <label className="create-topic-form__label" htmlFor="topic-desc">
        Описание (необязательно)
      </label>
      <textarea
        className="create-topic-form__textarea"
        id="topic-desc"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={500}
        rows={2}
      />

      <div className="create-topic-form__actions">
        <button
          className="create-topic-form__submit"
          type="submit"
          disabled={submitting || title.trim().length < 2}
        >
          {submitting ? 'Создание...' : 'Создать'}
        </button>
        <button
          className="create-topic-form__cancel"
          type="button"
          onClick={onCancel}
          disabled={submitting}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
