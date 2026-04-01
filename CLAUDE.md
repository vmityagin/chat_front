# VpodushamApp — Dev Front

Фронтенд тематического чата. Next.js 14 (App Router) + React 18 + Socket.IO Client.

## Система агентов

Прочитай `.claude/agents/orchestrator.md` — координатор фронтенд-команды из 5 агентов.

| Агент | Файл | Зона |
|---|---|---|
| PAGES | `agents/pages.md` | Страницы, layout, роутинг |
| COMPONENTS | `agents/components.md` | React-компоненты |
| API-CLIENT | `agents/api-client.md` | HTTP-клиент, fetch, токены |
| REALTIME-CLIENT | `agents/realtime-client.md` | Socket.IO клиент |
| STYLES | `agents/styles.md` | CSS (BEM) |

### Связь с бэкендом
Бэкенд-агенты в `../dev_server/.claude/agents/` — читай ROUTES, ERRORS, REALTIME для понимания API.

## Быстрые команды

```bash
npm run dev      # Запуск на порту 3001
npm run lint     # Проверка стиля
npm run build    # Production build
```

## Ключевые правила

- Все компоненты — `'use client'` (клиентские)
- CSS — BEM, файлы в `src/blocks/<name>/<name>.css`
- API через `apiFetch()` из `src/lib/apiClient.js`
- Socket через `useSocket()` из `src/hooks/useSocket.js`
- Ошибки через Toast (Context `useToast()`)
- localStorage: `chat_user` — данные пользователя
- Язык UI: русский (хардкод)
- Path alias: `@/*` → `./src/*`

## Текущее состояние

Фронтенд НЕ обновлён под JWT. Сейчас использует cookie-based auth. Требуется миграция:
- `apiClient.js`: добавить Bearer token, auto-refresh
- `useSocket.js`: передавать JWT через `auth.token`
- `RegisterForm`: email + password вместо nickname-only
- Новый `LoginForm`: вход по email + password
- `ChatApp`: управление auth state через токены
