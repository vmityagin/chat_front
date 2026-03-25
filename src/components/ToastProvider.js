'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { registerErrorHandler } from '../lib/apiClient';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showError = useCallback((message, code) => {
    setToast({ message: message || 'Ошибка сервера', code });
  }, []);

  const close = useCallback(() => setToast(null), []);

  useEffect(() => {
    registerErrorHandler(showError);
  }, [showError]);

  return (
    <ToastContext.Provider value={{ showError }}>
      {children}
      {toast && (
        <div className="toast">
          <p className="toast__message">{toast.message}</p>
          {toast.code && <p className="toast__code">{toast.code}</p>}
          <button className="toast__close" onClick={close} aria-label="Закрыть">✕</button>
        </div>
      )}
    </ToastContext.Provider>
  );
}
