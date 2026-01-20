# AI-ассистент на TON + Cocoon

## Архитектура

```
┌─────────────────────────────────────────────────────────┐
│                    Telegram User                        │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              Telegram Mini App / Bot                    │
│  - UI для ввода запросов                                │
│  - Отображение баланса                                  │
│  - История запросов                                     │
└─────────────────────┬───────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────┐    ┌─────────────────────────────────┐
│   TON Wallet    │    │         Cocoon API              │
│  - Оплата TON   │    │  - AI inference (DeepSeek,      │
│  - Баланс       │    │    Qwen, и др.)                 │
│  - TON Connect  │    │  - Приватные вычисления в TEE   │
└─────────────────┘    └─────────────────────────────────┘
```

## MVP функционал

| Функция | Описание |
|---------|----------|
| 💬 Чат с AI | Ответы на вопросы через Cocoon |
| 📄 Суммаризация | Отправь документ → получи краткое содержание |
| 💰 Оплата | TON или Telegram Stars за запросы |
| 📊 Баланс | Показ остатка и истории |

## Технологии

### Frontend (Mini App)
- React / Next.js
- TON Connect (подключение кошелька)
- Telegram Mini Apps SDK

### Backend
- Node.js / Python
- grammY или python-telegram-bot
- Cocoon SDK/API

### Платежи
- TON Connect для крипто
- Telegram Stars для фиата

## План разработки

### Неделя 1: Базовый бот
- Создать бота через @BotFather
- Настроить webhook
- Простой echo-бот

### Неделя 2: Интеграция Cocoon
- Зарегистрироваться на https://cocoon.org
- Получить API ключ
- Подключить AI-модель (DeepSeek/Qwen)
- Тестовые запросы

### Неделя 3: Платежи
- TON Connect интеграция
- Смарт-контракт для депозитов (или простой кошелёк)
- Списание за запросы

### Неделя 4: Mini App UI
- Красивый интерфейс
- История чатов
- Настройки пользователя

## Монетизация

```
Пользователь платит:
┌─────────────────────────────────┐
│  1 запрос = 0.01-0.05 TON       │
│  Пакет 100 запросов = скидка    │
│  Подписка = безлимит            │
└─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Cocoon забирает ~70%           │
│  Ты оставляешь ~30% маржи       │
└─────────────────────────────────┘
```

## С чего начать прямо сейчас?

1. **Создай бота** — @BotFather в Telegram
2. **Зарегистрируйся** — https://cocoon.org (документация и API)
3. **Выбери стек** — Python (проще) или Node.js (быстрее)

## Полезные ссылки

- [Cocoon Network launch announcement](https://cryptobriefing.com/telegram-launches-cocoon-network-powered-by-ai-and-ton/)
- [Cocoon официальный сайт](https://cocoon.org)
- [TON - Accept payments in Telegram bot](https://old-docs.ton.org/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot)
- [TON Bot Example](https://github.com/Gusarich/ton-bot-example)
- [Telegram Bot Payments API](https://core.telegram.org/bots/payments)
