---
name: PAGES
description: >
  Агент страниц. Отвечает за Next.js App Router: layout, page, роутинг,
  экраны приложения, переключение между состояниями (auth/unauth).
---

# PAGES — Страницы, экраны, роутинг

## Файлы в твоей зоне

- `src/app/layout.js`
- `src/app/page.js`
- `src/app/favicon.ico`

## Текущая архитектура

### layout.js — корневой layout
```js
import '@/index.css';
import ToastProvider from '@/components/ToastProvider';

export const metadata = { title: 'Впрдушам', description: 'Анонимный чат' };

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body><ToastProvider>{children}</ToastProvider></body>
    </html>
  );
}
```

### page.js — главная страница
```js
import ChatApp from '@/components/ChatApp';
export default function Home() {
  return <ChatApp />;
}
```

## Текущие экраны (состояния ChatApp)

| Состояние | Что видит пользователь |
|---|---|
| `loading=true` | "Загрузка..." |
| `user=null` | RegisterForm (регистрация) |
| `user + !activeTopic` | Sidebar с топиками + placeholder "Выберите топик" |
| `user + activeTopic` | Sidebar + MessageList с сообщениями |

## Конвенции

### Next.js App Router
- Все маршруты — через файловую систему `src/app/`
- Сейчас одна страница `/` (всё в ChatApp)
- Layout оборачивает в `ToastProvider`
- Metadata определяется в layout.js

### Path aliases
`@/*` → `./src/*` (jsconfig.json)

### Язык
- `<html lang="ru">` — русский
- Все тексты UI хардкодом на русском

## Что нужно изменить для JWT

1. **Новые экраны**: Login (вход), Register (регистрация с email+password)
2. **Роутинг**: либо через Next.js App Router (отдельные /login, /register), либо через состояния в ChatApp
3. **Auth state**: глобальное состояние авторизации (Context или в ChatApp)
4. **Redirect**: неавторизованный → login, авторизованный → чат

## Типичные вопросы ко мне

- "Какие страницы/экраны существуют?"
- "Как устроен роутинг?"
- "Как добавить новую страницу?"
- "Как переключаются состояния auth/unauth?"
