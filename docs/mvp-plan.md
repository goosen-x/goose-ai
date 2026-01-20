# MVP Plan - Goose AI Telegram Mini App

## Стратегия: Модульная архитектура с миграцией на Cocoon

### Цель
Запустить MVP быстро с готовым AI API, но спроектировать архитектуру так, чтобы легко переключиться на Cocoon Network, когда он станет доступен для разработчиков.

## Фазы разработки

### Фаза 1: MVP с OpenAI/Anthropic (2 недели)
Быстрый запуск с проверенным AI провайдером для валидации идеи и получения первых пользователей.

### Фаза 2: TON Integration (1 неделя)
Полноценная платёжная система с TON Connect.

### Фаза 3: Migration to Cocoon (когда API будет доступен)
Бесшовная миграция на Cocoon Network без изменения UX.

---

## Модульная архитектура AI Provider

### Абстракция AI Provider

```typescript
// lib/ai/provider.interface.ts
export interface AIProvider {
  name: string;
  sendMessage(message: string, options?: AIOptions): Promise<AIResponse>;
  streamMessage(message: string, options?: AIOptions): AsyncIterator<AIChunk>;
  getModels(): Promise<AIModel[]>;
  estimateCost(message: string, model?: string): number;
}

export interface AIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AIResponse {
  id: string;
  content: string;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  cost: number;
}

export interface AIChunk {
  delta: string;
  done: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  costPerToken: number;
  maxTokens: number;
}
```

### Провайдеры

```
lib/ai/
├── provider.interface.ts      # Общий интерфейс
├── openai-provider.ts         # OpenAI GPT-3.5/4
├── anthropic-provider.ts      # Claude (backup)
├── cocoon-provider.ts         # Cocoon (для будущего)
└── factory.ts                 # Выбор провайдера
```

### Factory Pattern

```typescript
// lib/ai/factory.ts
import { AIProvider } from './provider.interface';
import { OpenAIProvider } from './openai-provider';
import { CocoonProvider } from './cocoon-provider';

export function createAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || 'openai';

  switch (provider) {
    case 'openai':
      return new OpenAIProvider({
        apiKey: process.env.OPENAI_API_KEY!
      });

    case 'cocoon':
      return new CocoonProvider({
        apiKey: process.env.COCOON_API_KEY!,
        tonWallet: process.env.COCOON_WALLET!
      });

    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}
```

### Переключение провайдера

Чтобы переключиться с OpenAI на Cocoon:
1. Установить переменную `AI_PROVIDER=cocoon`
2. Добавить Cocoon credentials
3. Deploy - всё остальное работает без изменений

---

## План MVP - Детальный

### Week 1: Core Infrastructure

#### Day 1-2: Project Setup
- [x] Инициализация Next.js проекта
- [x] Настройка shadcn/ui
- [x] GitHub репозиторий
- [x] Vercel деплой
- [ ] Настройка Neon PostgreSQL
- [ ] Prisma setup & migrations

#### Day 3-4: Telegram Mini App
- [ ] Установка `@telegram-apps/sdk-react`
- [ ] Provider для Telegram SDK
- [ ] Инициализация Mini App
- [ ] Получение user данных
- [ ] Базовый layout с Telegram theme

#### Day 5-7: AI Integration
- [ ] Создать AI provider interface
- [ ] Реализовать OpenAI provider
- [ ] API route `/api/chat`
- [ ] Streaming ответов (Server-Sent Events)
- [ ] Тестирование AI интеграции

### Week 2: User Interface & Features

#### Day 1-3: Chat Interface
- [ ] Компонент ChatInterface
- [ ] MessageList с виртуализацией
- [ ] MessageItem (user/assistant)
- [ ] InputForm с автосайзом
- [ ] Typing indicator
- [ ] Markdown рендеринг ответов
- [ ] Code syntax highlighting

#### Day 4-5: History & Balance
- [ ] Страница `/history` - список чатов
- [ ] Страница `/balance` - баланс и транзакции
- [ ] API `/api/user/history`
- [ ] API `/api/user/balance`

#### Day 6-7: Polish & Testing
- [ ] Loading states
- [ ] Error handling
- [ ] Rate limiting
- [ ] Оптимизация производительности
- [ ] Тестирование на разных устройствах

### Week 3: TON Integration

#### Day 1-2: TON Connect Setup
- [ ] Установка `@tonconnect/ui-react`
- [ ] TON Connect provider
- [ ] Wallet connect button
- [ ] Display wallet balance

#### Day 3-4: Payment System
- [ ] Smart contract или Payment API
- [ ] API `/api/payment/invoice`
- [ ] API `/api/payment/verify`
- [ ] Payment flow UI
- [ ] Transaction history

#### Day 5-7: Billing & Credits
- [ ] Credit system (1 credit = N запросов)
- [ ] Списание за запросы
- [ ] Пакеты покупки (10, 50, 100 кредитов)
- [ ] Уведомления о балансе
- [ ] Refund logic (если нужно)

### Week 4: Production Ready

#### Day 1-2: Monitoring & Analytics
- [ ] Error tracking (Sentry?)
- [ ] Usage analytics
- [ ] Cost tracking
- [ ] Performance monitoring

#### Day 3-4: Security & Optimization
- [ ] Rate limiting (per user)
- [ ] API key rotation
- [ ] Database indexes
- [ ] Caching strategy
- [ ] Image optimization

#### Day 5-7: Launch Preparation
- [ ] Production environment variables
- [ ] Database backup strategy
- [ ] Load testing
- [ ] Documentation для пользователей
- [ ] Marketing materials

---

## Технические детали

### Environment Variables

```bash
# MVP (OpenAI)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

# Database
DATABASE_URL=postgresql://...

# Telegram
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=@gooseai_bot

# TON
TON_NETWORK=testnet
NEXT_PUBLIC_TON_MANIFEST_URL=https://...

# App
NEXT_PUBLIC_APP_URL=https://goose-ai-pi.vercel.app

# Future: Cocoon
# AI_PROVIDER=cocoon
# COCOON_API_KEY=...
# COCOON_WALLET=...
```

### Database Schema (Prisma)

```prisma
// Для MVP
model User {
  id          String    @id              // Telegram user ID
  username    String?
  firstName   String?
  lastName    String?

  // Credits система (вместо прямого баланса TON)
  credits     Int       @default(0)      // Количество доступных кредитов

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  messages    Message[]
  payments    Payment[]

  // AI provider настройки
  preferredModel  String?  @default("gpt-3.5-turbo")
  aiProvider      String?  @default("openai")

  @@index([id])
}

model Message {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])

  role      String   // "user" | "assistant"
  content   String   @db.Text

  // AI metadata
  model     String?
  provider  String   @default("openai")  // "openai" | "cocoon"

  // Стоимость
  inputTokens   Int?
  outputTokens  Int?
  costCredits   Int   @default(1)        // Сколько кредитов списано

  createdAt DateTime @default(now())

  @@index([userId, createdAt])
}

model Payment {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  // TON Payment
  amountTON   Float    // Сумма в TON
  creditsAdded Int     // Сколько кредитов начислено

  status      String   // "pending" | "completed" | "failed"
  txHash      String?  // TON transaction hash

  createdAt   DateTime @default(now())
  completedAt DateTime?

  @@index([userId, status])
  @@index([txHash])
}

// Credit Packages
model CreditPackage {
  id          String  @id @default(cuid())
  name        String  // "Starter", "Pro", "Unlimited"
  credits     Int     // Количество кредитов
  priceTON    Float   // Цена в TON
  discount    Float?  // Скидка в %
  active      Boolean @default(true)
}
```

### API Routes

```
app/api/
├── chat/
│   └── route.ts           # POST - отправить сообщение
├── chat/
│   └── stream/route.ts    # GET - streaming ответ
├── user/
│   ├── route.ts           # GET/PATCH - user info
│   ├── balance/route.ts   # GET - credits balance
│   └── history/route.ts   # GET - chat history
├── payment/
│   ├── packages/route.ts  # GET - список пакетов
│   ├── invoice/route.ts   # POST - создать счёт
│   └── verify/route.ts    # POST - проверить оплату
└── models/
    └── route.ts           # GET - доступные AI модели
```

### Pricing Strategy

```typescript
// lib/pricing.ts
export const CREDIT_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 10,
    priceTON: 0.5,
    discount: 0,
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 50,
    priceTON: 2.0,
    discount: 20, // 20% скидка
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    credits: 200,
    priceTON: 5.0,
    discount: 40, // 40% скидка
  },
];

// Стоимость в кредитах
export const MODEL_COSTS = {
  'gpt-3.5-turbo': 1,      // 1 кредит за запрос
  'gpt-4': 3,              // 3 кредита за запрос
  'gpt-4-turbo': 2,        // 2 кредита за запрос
  // Future: Cocoon models
  'cocoon-deepseek': 1,
  'cocoon-qwen': 1,
};
```

---

## Migration Path to Cocoon

### Когда Cocoon API станет доступен:

#### Step 1: Реализовать CocoonProvider
```typescript
// lib/ai/cocoon-provider.ts
export class CocoonProvider implements AIProvider {
  name = 'cocoon';

  async sendMessage(message: string, options?: AIOptions): Promise<AIResponse> {
    // Cocoon API call
  }

  async *streamMessage(message: string, options?: AIOptions): AsyncIterator<AIChunk> {
    // Cocoon streaming
  }
}
```

#### Step 2: Обновить переменные окружения
```bash
AI_PROVIDER=cocoon
COCOON_API_KEY=...
COCOON_WALLET=...
```

#### Step 3: Deploy
Vercel auto-deploy, пользователи не замечают изменений.

#### Step 4: Мониторинг
- Отслеживать стоимость запросов
- Сравнить производительность
- Проверить качество ответов

#### Step 5: Gradual Rollout
- 10% пользователей на Cocoon
- 50% пользователей на Cocoon
- 100% migration

---

## Success Metrics

### MVP Launch (Week 4)
- [ ] 100+ активных пользователей
- [ ] 1000+ сообщений обработано
- [ ] 50+ платежей в TON
- [ ] <2 сек ответа на запрос
- [ ] 99% uptime

### Month 1
- [ ] 500+ активных пользователей
- [ ] 10,000+ сообщений
- [ ] $500+ в TON payments
- [ ] Positive user feedback

### Cocoon Migration
- [ ] <5% увеличение latency
- [ ] <20% снижение стоимости
- [ ] Улучшенная приватность
- [ ] No user complaints

---

## Риски и митигация

| Риск | Вероятность | Митигация |
|------|-------------|-----------|
| OpenAI API дорого | Высокая | Использовать gpt-3.5-turbo, лимиты |
| Cocoon API не выйдет | Средняя | Готовность остаться на OpenAI/Claude |
| Низкий спрос | Средняя | Marketing, бесплатные кредиты |
| Telegram блокировка | Низкая | Compliance с ToS |
| TON волатильность | Высокая | Динамическое ценообразование |

---

## Next Steps (Immediate)

1. [ ] Создать Neon PostgreSQL database
2. [ ] Настроить Prisma
3. [ ] Установить Telegram SDK
4. [ ] Получить OpenAI API key
5. [ ] Реализовать AI provider interface
6. [ ] Создать базовый чат UI

Готов начать с первого пункта?
