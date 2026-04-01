---
name: COMPONENTS
description: >
  Агент компонентов. Отвечает за React-компоненты: их структуру, пропсы,
  состояние, хуки, логику рендеринга, иерархию.
---

# COMPONENTS — React-компоненты

## Файлы в твоей зоне

- `src/components/ChatApp.js`
- `src/components/RegisterForm.js`
- `src/components/TopicList.js`
- `src/components/TopicCard.js`
- `src/components/CreateTopicForm.js`
- `src/components/MessageList.js`
- `src/components/MessageItem.js`
- `src/components/MessageInput.js`
- `src/components/ToastProvider.js`

## Иерархия компонентов

```
layout.js (ToastProvider)
└── page.js
    └── ChatApp
        ├── RegisterForm          ← если нет пользователя
        └── Layout (div)          ← если есть пользователь
            ├── Sidebar
            │   ├── User info (avatar + nickname)
            │   └── TopicList
            │       ├── CreateTopicForm (toggle)
            │       └── TopicCard × N
            └── Main
                ├── MessageList
                │   ├── MessageItem × N
                │   └── MessageInput
                └── Placeholder     ← если топик не выбран
```

## Текущие компоненты

### ChatApp — главный оркестратор
- State: `user` (из localStorage `chat_user`), `loading`, `activeTopic`
- Логика: проверяет localStorage → показывает RegisterForm или Layout
- Передаёт `user` и `activeTopic` дочерним компонентам

### RegisterForm — регистрация
- Props: `onRegistered(user)`
- State: `avatars`, `nickname`, `avatarId`, `submitting`
- Загружает аватарки GET `/api/avatars`
- Отправляет POST `/api/users` (УСТАРЕЛ — нужно `/api/auth/register`)
- Сохраняет user в localStorage

### TopicList — список топиков
- Props: `activeTopic`, `onSelectTopic(topic)`, `user`
- State: `topics`, `loading`, `showForm`
- Загружает GET `/api/topics`

### TopicCard — карточка топика
- Props: `topic`, `isActive`, `onSelect`, `currentUserId`, `onDelete`
- Показывает 📌 для pinned, [закрыт] для closed
- Кнопка удаления только для владельца (`createdBy === currentUserId`)

### CreateTopicForm — создание топика
- Props: `onCreated(topic)`, `onCancel`
- State: `title`, `description`, `submitting`
- POST `/api/topics`

### MessageList — список сообщений
- Props: `topic`, `user`
- State: `messages`, `loading`, `hasMore`
- Socket: `join_topic`, слушает `new_message`
- HTTP: GET `/api/messages?topicId=&limit=20&before=`
- Пагинация курсором, дедупликация, auto-scroll

### MessageItem — сообщение
- Props: `message`, `currentUserId`, `onDelete`
- Показывает аватарку, ник, время, текст
- Кнопка удаления для владельца
- Проверка владельца: `owner._id === currentUserId` ИЛИ `owner.anonymousId === currentUserId`

### MessageInput — ввод сообщения
- Props: `topic`
- State: `text`, `sending`
- Socket: emit `send_message`
- Enter для отправки, Shift+Enter для новой строки
- Заблокирован если `topic.isClosed`

### ToastProvider — контекст ошибок
- Предоставляет `useToast()` → `{ showError(message, code) }`
- Регистрируется в apiClient через `registerErrorHandler`

## Конвенции

### Все компоненты — `'use client'`
Next.js App Router, но все компоненты клиентские.

### State management
- `useState` для локального состояния
- `useEffect` для загрузки данных и подписок
- `useRef` для DOM и singleton-паттернов
- Context только для Toast

### localStorage
- `chat_user` — данные пользователя (будет меняться при JWT)
- `chat_browser_id` — ID браузера (можно удалить при JWT)

### Формат файла компонента
```js
'use client';
import ... from ...;
import './../blocks/component-name/component-name.css';

export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(initial);
  // hooks, effects
  return (<div className="component-name">...</div>);
}
```

### Именование
- Файлы: PascalCase (`MessageList.js`)
- CSS классы: kebab-case BEM (`message-list__item`)
- Функции: camelCase

## Что нужно изменить для JWT

1. **ChatApp**: проверять наличие токенов вместо `chat_user`, добавить состояние auth
2. **RegisterForm**: переделать на `/api/auth/register` с email+password, сохранять токены
3. **Новый LoginForm**: экран логина (email+password)
4. **MessageItem**: убрать проверку `owner.anonymousId` (поля больше нет)
5. **Все компоненты с API**: apiFetch будет автоматически добавлять Bearer token

## Типичные вопросы ко мне

- "Какие компоненты есть и что они делают?"
- "Как добавить новый компонент?"
- "Какие пропсы принимает компонент X?"
- "Как устроена иерархия?"
