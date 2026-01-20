# Goose AI - Telegram Mini App Setup Guide

## Что было реализовано

Приложение Goose AI успешно конвертировано в Telegram Mini App с полной нативной интеграцией.

### ✅ Реализованные функции

1. **Telegram SDK Integration**
   - Инициализация SDK с проверкой окружения
   - React Context Provider для доступа к SDK
   - Набор React hooks для всех Telegram API

2. **Нативный UI/UX**
   - Удалена нижняя панель навигации
   - Удален header (используется Telegram header)
   - Telegram Back Button для навигации
   - Haptic Feedback на действия пользователя
   - Dynamic viewport height управление

3. **Theme Sync**
   - Автоматическая синхронизация темы Telegram
   - Конвертация RGB → OKLCH цветов
   - Поддержка светлой и темной темы

4. **Security**
   - Server-side валидация Telegram initData
   - HMAC-SHA256 подпись проверка
   - API endpoint для аутентификации

5. **Developer Experience**
   - Eruda debugger для мобильной отладки
   - TypeScript типизация для всех Telegram API
   - Подробное логирование в development режиме

---

## 📋 Следующие шаги

### 1. Создать Telegram бота

1. Открыть Telegram и найти [@BotFather](https://t.me/BotFather)
2. Отправить команду `/newbot`
3. Следовать инструкциям:
   - Ввести имя бота (например: "Goose AI")
   - Ввести username бота (например: "goose_ai_bot")
4. Скопировать **Bot Token**

### 2. Настроить переменные окружения

Открыть `.env.local` и заменить placeholder значения:

```bash
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz  # Ваш токен от BotFather
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=goose_ai_bot             # Ваш username бота
```

### 3. Локальное тестирование

#### Вариант A: Используя ngrok (рекомендуется)

1. Установить ngrok:
   ```bash
   brew install ngrok  # macOS
   # или скачать с https://ngrok.com/
   ```

2. В одном терминале запустить dev сервер:
   ```bash
   pnpm dev
   ```

3. В другом терминале запустить ngrok:
   ```bash
   ngrok http 3000
   ```

4. Скопировать HTTPS URL из ngrok (например: `https://abc123.ngrok.io`)

#### Вариант B: Используя VSCode Port Forwarding

1. Запустить dev сервер: `pnpm dev`
2. В VSCode: открыть панель PORTS
3. Нажать "Forward a Port" → ввести 3000
4. Выбрать "Public" visibility
5. Скопировать forwarded URL

### 4. Настроить Mini App в BotFather

1. Открыть [@BotFather](https://t.me/BotFather)
2. Отправить `/myapps`
3. Выбрать вашего бота
4. Выбрать "Edit Web App URL"
5. Ввести URL из ngrok/VSCode (например: `https://abc123.ngrok.io`)

**Дополнительные настройки бота:**
```
/setdescription - описание бота
/setabouttext - about text
/setuserpic - загрузить иконку
/setmenubutton - настроить menu button
```

### 5. Тестирование

1. Открыть Telegram
2. Найти вашего бота
3. Нажать кнопку "Open App" или "Menu"
4. Приложение должно открыться в Telegram

**Что проверить:**
- ✅ Приложение открывается без ошибок
- ✅ Тема автоматически синхронизируется с Telegram
- ✅ Back button показывается и работает
- ✅ Viewport height корректно адаптируется
- ✅ Haptic feedback при отправке сообщений
- ✅ Chat функционал работает (стриминг ответов)

### 6. Отладка на мобильных устройствах

Eruda console уже настроен для development режима:
- Откройте Mini App на мобильном устройстве
- В правом нижнем углу появится кнопка Eruda
- Нажмите для открытия mobile console
- Доступны: Console, Network, Elements, Resources

---

## 🚀 Production Deployment

### 1. Deploy на Vercel

1. Push код на GitHub
2. Импортировать проект в Vercel
3. Добавить environment variables в Vercel Dashboard:
   - `GROQ_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`
4. Deploy

### 2. Обновить URL в BotFather

1. Открыть [@BotFather](https://t.me/BotFather)
2. `/myapps` → выбрать бота → "Edit Web App URL"
3. Ввести production URL из Vercel (например: `https://goose-ai.vercel.app`)

### 3. Тестирование Production

1. Открыть бота в Telegram
2. Нажать "Open App"
3. Проверить все функции

---

## 📁 Структура проекта

```
lib/telegram/
├── init.ts              # Инициализация Telegram SDK
├── types.ts             # TypeScript типы
├── hooks.ts             # React hooks для Telegram API
├── theme.ts             # Конвертация цветов RGB → OKLCH
└── validate.ts          # Server-side валидация initData

components/telegram/
├── telegram-provider.tsx     # React Context Provider
└── telegram-theme-sync.tsx   # Синхронизация темы

components/shared/
└── eruda-debugger.tsx        # Mobile debugger (dev only)

app/api/telegram-auth/
└── route.ts                  # POST endpoint для валидации
```

---

## 🔧 API Endpoints

### POST /api/telegram-auth

Валидирует Telegram initData и возвращает информацию о пользователе.

**Request:**
```json
{
  "initData": "query_id=AAH...&user=..."
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 123456789,
    "firstName": "John",
    "username": "john_doe"
  },
  "sessionToken": "...",
  "authDate": 1234567890
}
```

### GET /api/telegram-auth (dev only)

Проверяет конфигурацию бота (только в development).

---

## 📱 Telegram API Features

### Доступные hooks:

```typescript
// SDK и пользователь
useTelegramSDK()        // Получить SDK instance
useTelegramUser()       // Получить текущего пользователя
useIsInTelegram()       // Проверка окружения

// UI/UX
useTelegramTheme()      // Получить тему Telegram
useTelegramViewport()   // Dynamic viewport height
useTelegramBackButton() // Управление кнопкой Назад
useTelegramMainButton() // Управление главной кнопкой

// Feedback
useTelegramHaptic()     // Haptic feedback
  // - impactLight/Medium/Heavy
  // - notificationSuccess/Error/Warning
  // - selectionChanged

// App control
useTelegramMiniApp()    // Управление Mini App
  // - expand, close
  // - enableClosingConfirmation
```

### Пример использования:

```typescript
'use client'

import { useTelegramHaptic, useTelegramBackButton } from '@/lib/telegram/hooks'

export function MyComponent() {
  const { impactLight } = useTelegramHaptic()
  const { show, onClick } = useTelegramBackButton()

  useEffect(() => {
    show()
    const unsubscribe = onClick(() => {
      // Handle back button
    })
    return unsubscribe
  }, [])

  const handleClick = () => {
    impactLight() // Haptic feedback
    // Your action
  }

  return <button onClick={handleClick}>Click me</button>
}
```

---

## ⚠️ Важные моменты

1. **Приложение работает только в Telegram**
   - При открытии в браузере показывается сообщение об ошибке
   - TelegramProvider проверяет окружение и блокирует загрузку

2. **Валидация initData**
   - В app/api/chat/route.ts валидация сделана опциональной
   - Для production рекомендуется сделать обязательной
   - Раскомментировать проверку и добавить return 401 при ошибке

3. **Theme sync**
   - Цвета автоматически конвертируются из RGB в OKLCH
   - CSS переменные обновляются динамически
   - Dark mode класс устанавливается автоматически

4. **Viewport management**
   - Height обновляется при изменении viewport
   - CSS переменная --tg-viewport-height доступна глобально
   - Используется для динамической высоты контейнеров

---

## 🐛 Troubleshooting

### Ошибка: "Not in Telegram environment"
- Убедитесь, что открываете через Telegram Mini App
- Проверьте, что URL правильно настроен в BotFather

### Ошибка: "Invalid Telegram data"
- Проверьте, что TELEGRAM_BOT_TOKEN правильный
- Убедитесь, что токен не истёк
- Проверьте логи в console (Eruda)

### UI не адаптируется к Telegram теме
- Проверьте, что TelegramThemeSync рендерится
- Откройте DevTools/Eruda → проверьте CSS переменные
- Убедитесь, что .telegram-theme класс применён

### Haptic не работает
- Haptic feedback работает только на мобильных устройствах
- На Desktop/Web версии Telegram haptic не поддерживается
- Проверьте, что вызываете методы правильно

---

## 📚 Полезные ссылки

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Telegram Apps SDK](https://docs.telegram-mini-apps.com/)
- [BotFather](https://t.me/BotFather)
- [ngrok](https://ngrok.com/)

---

## 🎉 Готово!

Ваше приложение Goose AI теперь полноценный Telegram Mini App с максимальной нативностью и всеми возможностями Telegram SDK.

Следующие улучшения:
- Добавить Main Button для альтернативного submit
- Реализовать History хранение в Telegram Cloud Storage
- Добавить биллинг через Telegram Stars
- Интегрировать Telegram Payments
