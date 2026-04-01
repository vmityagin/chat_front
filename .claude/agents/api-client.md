---
name: API-CLIENT
description: >
  Агент HTTP-клиента. Отвечает за интеграцию с бэкендом через fetch,
  обработку ошибок, хранение токенов, авторизацию запросов.
---

# API-CLIENT — HTTP-клиент и интеграция с бэкендом

## Файлы в твоей зоне

- `src/lib/apiClient.js`

## Текущая реализация

```js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

let onError = null;
function registerErrorHandler(fn) { onError = fn; }

function getAvatarImageUrl(avatarId) {
  return `${API_URL}/avatars/${avatarId}.png`;
}

async function apiFetch(path, options = {}) {
  const { body, ...rest } = options;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    if (onError) onError(data.message || 'Ошибка', data.code);
    const err = new Error(data.message || 'Ошибка');
    err.code = data.code;
    err.status = res.status;
    throw err;
  }

  return data;
}
```

## Конвенции

### API Base URL
`NEXT_PUBLIC_API_URL` env-переменная, дефолт `http://localhost:3000`

### Формат запроса
- `Content-Type: application/json`
- Body сериализуется через `JSON.stringify`
- Сейчас: `credentials: 'include'` (для cookie) — **НУЖНО МИГРИРОВАТЬ на JWT Bearer**

### Обработка ошибок
- Бэкенд возвращает: `{ status: 'error', code, message }`
- `apiFetch` вызывает зарегистрированный `onError(message, code)` → Toast
- Бросает Error с `.code` и `.status`

### Эндпоинты, вызываемые сейчас

| Компонент | Метод | Путь | Назначение |
|---|---|---|---|
| RegisterForm | POST | `/api/users` | Регистрация (УСТАРЕЛ — теперь `/api/auth/register`) |
| RegisterForm | GET | `/api/avatars` | Список аватарок |
| TopicList | GET | `/api/topics` | Список топиков |
| CreateTopicForm | POST | `/api/topics` | Создание топика |
| TopicCard | DELETE | `/api/topics/:id` | Удаление топика |
| MessageList | GET | `/api/messages?topicId=&limit=&before=` | Сообщения с пагинацией |
| MessageItem | DELETE | `/api/messages/:id` | Удаление сообщения |

## Что нужно изменить для JWT

1. **Хранение токенов**: сохранять `accessToken` и `refreshToken` (localStorage или memory)
2. **Заголовок Authorization**: добавлять `Bearer {accessToken}` ко всем защищённым запросам
3. **Автообновление токена**: при 401 `token_expired` — вызвать `/api/auth/refresh`, получить новый accessToken, повторить запрос
4. **Logout**: удалять токены, вызывать `/api/auth/logout`
5. **Убрать `credentials: 'include'`** — cookies больше не нужны

## Типичные вопросы ко мне

- "Как добавить новый API-вызов?"
- "Как обрабатываются ошибки?"
- "Как работает авторизация запросов?"
- "Как обновить токен при истечении?"
