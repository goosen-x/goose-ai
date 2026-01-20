# Архитектура проекта Goose AI

## Описание
Telegram Mini App для общения с AI через Cocoon Network с оплатой в TON.

## Технический стек

### Frontend
- **Next.js 16** - App Router, React Server Components
- **React 19** - UI библиотека
- **TypeScript** - строгая типизация
- **Tailwind CSS v4** - стилизация
- **shadcn/ui** (radix-lyra) - UI компоненты
- **Lucide Icons** - иконки
- **@telegram-apps/sdk-react** - Telegram Mini App SDK
- **@tonconnect/ui-react** - TON Connect для кошелька

### Backend
- **Next.js API Routes** - serverless API
- **Prisma** - ORM для работы с БД
- **Neon PostgreSQL** - serverless база данных
- **Zod** - валидация данных
- **ky** - HTTP клиент для внешних API

### Интеграции
- **Cocoon Network** - AI inference (DeepSeek, Qwen)
- **TON Blockchain** - платежи и баланс
- **Telegram Mini Apps** - платформа для запуска

## Архитектура

```
┌──────────────────────────────────────────────┐
│         Telegram (iOS/Android/Web)           │
│  ┌────────────────────────────────────────┐  │
│  │   Telegram Mini App (Next.js)          │  │
│  │                                        │  │
│  │  Pages:                                │  │
│  │  - / (chat interface)                  │  │
│  │  - /history (chat history)             │  │
│  │  - /balance (wallet & payments)        │  │
│  │  - /settings (user settings)           │  │
│  │                                        │  │
│  │  Telegram WebApp SDK                   │  │
│  │  TON Connect UI                        │  │
│  └────────────┬───────────────────────────┘  │
└───────────────┼──────────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
┌────────────────┐  ┌──────────────────┐
│  Next.js API   │  │   TON Blockchain │
│                │  │                  │
│  /api/chat     │  │  - Payments      │
│  /api/cocoon   │  │  - Balance check │
│  /api/user     │  │  - Transactions  │
│  /api/payment  │  └──────────────────┘
└───────┬────────┘
        │
    ┌───┴────┐
    │        │
    ▼        ▼
┌─────────┐ ┌──────────────────┐
│  Neon   │ │  Cocoon Network  │
│  Postgres│ │                  │
│         │ │  - AI Models     │
│ - Users │ │  - DeepSeek      │
│ - Chats │ │  - Qwen          │
│ - Txns  │ │  - Streaming     │
└─────────┘ └──────────────────┘
```

## Структура проекта

```
goose-ai/
├── app/
│   ├── (mini-app)/              # Telegram Mini App routes
│   │   ├── page.tsx             # Главная - чат интерфейс
│   │   ├── history/
│   │   │   └── page.tsx         # История чатов
│   │   ├── balance/
│   │   │   └── page.tsx         # Баланс и пополнение
│   │   └── settings/
│   │       └── page.tsx         # Настройки пользователя
│   │
│   ├── api/                     # API Routes
│   │   ├── chat/
│   │   │   └── route.ts         # POST - отправить сообщение в AI
│   │   ├── cocoon/
│   │   │   ├── stream/route.ts  # GET - streaming ответ
│   │   │   └── models/route.ts  # GET - список моделей
│   │   ├── user/
│   │   │   ├── balance/route.ts # GET - баланс
│   │   │   ├── history/route.ts # GET - история
│   │   │   └── route.ts         # GET/PATCH - данные пользователя
│   │   └── payment/
│   │       ├── invoice/route.ts # POST - создать счёт
│   │       └── verify/route.ts  # POST - проверить платёж
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                      # shadcn/ui компоненты
│   ├── chat/
│   │   ├── chat-interface.tsx   # Основной интерфейс чата
│   │   ├── message-list.tsx     # Список сообщений
│   │   ├── message-item.tsx     # Отдельное сообщение
│   │   └── input-form.tsx       # Форма ввода
│   ├── balance/
│   │   ├── balance-card.tsx     # Карточка баланса
│   │   └── payment-form.tsx     # Форма оплаты
│   ├── history/
│   │   └── chat-list.tsx        # Список чатов
│   └── providers/
│       ├── telegram-provider.tsx # Telegram SDK context
│       ├── ton-provider.tsx      # TON Connect context
│       └── query-provider.tsx    # React Query provider
│
├── lib/
│   ├── telegram/
│   │   ├── client.ts            # Telegram SDK helpers
│   │   └── hooks.ts             # React hooks для Telegram
│   ├── ton/
│   │   ├── connect.ts           # TON Connect utils
│   │   ├── payment.ts           # Платёжные функции
│   │   └── hooks.ts             # React hooks для TON
│   ├── cocoon/
│   │   ├── client.ts            # Cocoon API client
│   │   ├── types.ts             # TypeScript типы
│   │   └── streaming.ts         # Streaming helpers
│   ├── db/
│   │   ├── client.ts            # Prisma client singleton
│   │   ├── user.ts              # User queries
│   │   ├── message.ts           # Message queries
│   │   └── payment.ts           # Payment queries
│   ├── schemas/                 # Zod validation schemas
│   │   ├── user.ts
│   │   ├── message.ts
│   │   └── payment.ts
│   └── utils.ts
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
│
├── docs/
│   ├── project-plan.md          # План проекта
│   └── architecture.md          # Этот файл
│
└── CLAUDE.md                    # Инструкции для Claude Code
```

## База данных (Neon PostgreSQL)

### Schema

```prisma
model User {
  id          String    @id              // Telegram user ID
  username    String?
  firstName   String?
  lastName    String?
  balance     Float     @default(0)      // Баланс в TON
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  messages    Message[]
  payments    Payment[]

  @@index([id])
}

model Message {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])

  role      String   // "user" | "assistant"
  content   String   @db.Text
  model     String?  // Cocoon model used
  cost      Float    @default(0)

  createdAt DateTime @default(now())

  @@index([userId, createdAt])
}

model Payment {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  amount      Float    // Сумма в TON
  status      String   // "pending" | "completed" | "failed"
  txHash      String?  // TON transaction hash

  createdAt   DateTime @default(now())
  completedAt DateTime?

  @@index([userId, status])
  @@index([txHash])
}
```

### Подключение к Neon

1. Создать проект на https://neon.tech
2. Скопировать connection string
3. Добавить в `.env.local`:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

## API Routes

### POST /api/chat
Отправить сообщение в AI

**Request:**
```json
{
  "message": "Привет, как дела?",
  "model": "deepseek" // optional
}
```

**Response:**
```json
{
  "id": "msg_123",
  "content": "Привет! Всё отлично...",
  "cost": 0.01
}
```

### GET /api/cocoon/stream
Streaming ответ от AI

**Query params:**
- `message` - текст сообщения
- `model` - модель AI (optional)

**Response:** Server-Sent Events stream

### GET /api/user/balance
Получить баланс пользователя

**Response:**
```json
{
  "balance": 1.5,
  "currency": "TON"
}
```

### POST /api/payment/invoice
Создать счёт для оплаты

**Request:**
```json
{
  "amount": 1.0
}
```

**Response:**
```json
{
  "invoiceId": "inv_123",
  "paymentUrl": "ton://...",
  "qrCode": "data:image/png;base64,..."
}
```

## Telegram Mini App

### Инициализация

```typescript
import { initMiniApp } from '@telegram-apps/sdk-react';

const miniApp = initMiniApp();
const user = miniApp.initDataUnsafe?.user;
```

### TON Connect

```typescript
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';

function WalletButton() {
  const wallet = useTonWallet();

  return <TonConnectButton />;
}
```

## Cocoon Integration

### API Client

```typescript
import ky from 'ky';

const cocoon = ky.extend({
  prefixUrl: 'https://api.cocoon.org/v1',
  headers: {
    'Authorization': `Bearer ${process.env.COCOON_API_KEY}`
  }
});

export async function sendMessage(message: string, model: string) {
  return cocoon.post('chat', {
    json: { message, model }
  }).json();
}
```

## Деплой

### Vercel
1. Подключить GitHub репозиторий
2. Добавить environment variables:
   - `DATABASE_URL` - Neon connection string
   - `COCOON_API_KEY` - Cocoon API key
   - `TON_NETWORK` - mainnet/testnet
3. Deploy

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Cocoon
COCOON_API_KEY="..."

# TON
TON_NETWORK="testnet"  # или "mainnet"

# App
NEXT_PUBLIC_APP_URL="https://..."
```

## Следующие шаги

1. ✅ Определить стек и архитектуру
2. 🔲 Установить зависимости (Prisma, Telegram SDK, TON Connect)
3. 🔲 Настроить Neon PostgreSQL
4. 🔲 Создать Prisma schema и миграции
5. 🔲 Создать базовые компоненты UI
6. 🔲 Интегрировать Telegram Mini App SDK
7. 🔲 Подключить TON Connect
8. 🔲 Интегрировать Cocoon API
9. 🔲 Реализовать платёжную систему
10. 🔲 Тестирование и деплой
