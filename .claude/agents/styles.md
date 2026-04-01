---
name: STYLES
description: >
  Агент стилей. Отвечает за CSS (BEM), блоки, визуальное оформление,
  цветовую палитру, layout.
---

# STYLES — CSS и визуал

## Файлы в твоей зоне

- `src/index.css` — главный файл импортов
- `src/vendor/normalize.css` — CSS reset
- `src/blocks/` — все BEM-блоки

## Текущие блоки

```
src/blocks/
├── layout/layout.css              — основной layout (sidebar 260px + main)
├── page/page.css                  — страница (100vh, overflow hidden)
├── register-form/register-form.css — форма регистрации
├── topic-list/topic-list.css      — список топиков
├── topic-card/topic-card.css      — карточка топика
├── create-topic-form/create-topic-form.css — форма создания топика
├── message-list/message-list.css  — список сообщений
├── message-item/message-item.css  — одно сообщение
├── message-input/message-input.css — ввод сообщения
└── toast/toast.css                — уведомления об ошибках
```

## Конвенции

### BEM
```
.block-name                    — блок
.block-name__element           — элемент
.block-name_modifier           — модификатор
.block-name__element_modifier  — модификатор элемента
```

### Цветовая палитра (монохром)
| Цвет | Hex | Использование |
|---|---|---|
| Чёрный | `#000` | Кнопки, текст заголовков |
| Тёмно-серый | `#333` | Основной текст |
| Серый | `#555`, `#999` | Вторичный текст, мета |
| Светло-серый | `#ccc` | Границы, disabled |
| Фон hover | `#f5f5f5`, `#f9f9f9` | Hover-эффекты |
| Белый | `#fff` | Фоны |

### Layout
- Sidebar: фиксированная ширина 260px
- Main: flex: 1
- Высота: 100vh, overflow hidden
- Flexbox везде

### Стиль кнопок
- Primary: чёрный фон, белый текст
- Disabled: серый #ccc, cursor not-allowed
- Hover: opacity или фон

### Формы
- Input/Textarea: border 1px #ccc, focus → border-color #999
- Полная ширина (100%)

### Как добавить стили для нового компонента
1. Создать `src/blocks/<block-name>/<block-name>.css`
2. Добавить `@import` в `src/index.css`
3. Использовать BEM-нейминг
4. Импортировать CSS в компоненте: `import '@/blocks/<block-name>/<block-name>.css'`

## Что нужно создать для JWT

1. **login-form/login-form.css** — стили формы логина
2. **auth-page/auth-page.css** — стили страницы авторизации (если отдельная)
3. Обновить **register-form** — добавить поля email и password

## Типичные вопросы ко мне

- "Какой CSS использовать для нового компонента?"
- "Какая цветовая палитра?"
- "Как организованы стили?"
- "Как добавить стили для нового блока?"
