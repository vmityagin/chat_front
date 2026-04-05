'use client';

import React, { useState } from 'react';
import { apiUploadTopicFile } from '../lib/apiClient';
import { useToast } from './ToastProvider';

export default function AdminFilesSection({ topics }) {
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedTopicId || !selectedFile) return;

    setUploading(true);
    try {
      await apiUploadTopicFile(selectedTopicId, selectedFile);
      toast.showSuccess('Файл загружен');
      setSelectedFile(null);
      // сброс input file
      e.target.reset();
    } catch (err) {
      toast.showError(err.message || 'Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="admin-page__files-section">
      <h2 className="admin-page__files-section-title">Файлы топиков</h2>
      <form className="admin-page__files-form" onSubmit={handleSubmit}>
        <select
          className="admin-page__files-select"
          value={selectedTopicId}
          onChange={(e) => setSelectedTopicId(e.target.value)}
          required
        >
          <option value="">— Выберите топик —</option>
          {topics.map((t) => (
            <option key={t._id} value={t._id}>
              {t.title}
            </option>
          ))}
        </select>
        <input
          className="admin-page__files-input"
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => setSelectedFile(e.target.files[0] || null)}
          required
        />
        <button
          className="admin-page__files-submit"
          type="submit"
          disabled={uploading || !selectedTopicId || !selectedFile}
        >
          {uploading ? 'Загрузка...' : 'Загрузить файл'}
        </button>
      </form>
    </section>
  );
}
