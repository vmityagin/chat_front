'use client';

import React, { useState, useEffect } from 'react';
import { apiGetTopicFiles } from '../lib/apiClient';
import '../blocks/topic-files/topic-files.css';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

export default function TopicFiles({ topic, onBack }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiGetTopicFiles(topic._id)
      .then(setFiles)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [topic._id]);

  return (
    <div className="topic-files">
      <button className="topic-files__back" type="button" onClick={onBack}>
        ← Назад в чат
      </button>
      <h2 className="topic-files__title">{topic.title} — Файлы</h2>

      {loading && <p className="topic-files__loading">Загрузка...</p>}

      {!loading && files.length === 0 && (
        <p className="topic-files__empty">Файлов пока нет</p>
      )}

      {!loading && files.length > 0 && (
        <ul className="topic-files__list">
          {files.map((file) => (
            <li key={file._id} className="topic-files__item">
              <span className="topic-files__icon">📄</span>
              <div className="topic-files__info">
                <span className="topic-files__filename">{file.filename}</span>
                <span className="topic-files__size">{formatSize(file.size)}</span>
              </div>
              <a
                className="topic-files__download"
                href={file.cdnUrl}
                download={file.filename}
                target="_blank"
                rel="noreferrer"
              >
                Скачать
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
