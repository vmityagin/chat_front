import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

let sharedSocket = null;

function getSocket() {
  if (!sharedSocket) {
    sharedSocket = io(API_URL, {
      withCredentials: true,
      autoConnect: true,
    });

    sharedSocket.on('connect_error', (err) => {
      console.error('[socket] connect_error:', err.message);
    });
  }
  return sharedSocket;
}

/**
 * Возвращает singleton socket.
 * onError вызывается при ошибке соединения.
 */
export function useSocket(onError) {
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const socket = getSocket();

  useEffect(() => {
    function handleConnectError(err) {
      onErrorRef.current?.(err.message);
    }
    socket.on('connect_error', handleConnectError);
    return () => {
      socket.off('connect_error', handleConnectError);
    };
  }, [socket]);

  return socket;
}
