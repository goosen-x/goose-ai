# Development Guide

## Overview

Это руководство по разработке Goose AI, основанное на best practices из Cocoon Network и современных подходах к API design.

## Core Principles

### 1. Backward Compatibility

**Всегда** поддерживайте обратную совместимость:

```typescript
// ✅ Правильно: добавляем optional поля
interface APIResponse {
  data: string;
  debug?: DebugInfo;  // Новое optional поле
}

// ❌ Неправильно: изменяем существующие поля
interface APIResponse {
  data: number;  // Было string, стало number - breaking change!
}
```

### 2. Protocol Versioning

Используйте версионирование для управления breaking changes:

```typescript
interface RequestHeaders {
  'X-API-Version'?: string;  // '1' | '2' | '3'
}

// Protocol negotiation
function negotiateVersion(clientMin: number, clientMax: number): number {
  const serverVersion = 2;
  return Math.min(clientMax, serverVersion);
}
```

### 3. Debug Mode

Предоставляйте детальную отладочную информацию:

```typescript
interface CompletionRequest {
  model: string;
  messages: Message[];
  enable_debug?: boolean;  // Включить timing статистику
}

interface DebugInfo {
  timing: {
    client_start: number;
    client_end: number;
    cocoon_start: number;
    cocoon_end: number;
  };
  tokens: {
    prompt: number;
    completion: number;
    cached: number;
  };
  cost_breakdown: {
    prompt_cost: number;
    completion_cost: number;
    total_cost: number;
  };
}
```

### 4. Cost Transparency

Всегда включайте стоимость в ответы:

```typescript
interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  // Cocoon pattern: детальная информация о стоимости
  prompt_total_cost: number;      // в nanoTON
  completion_total_cost: number;
  total_cost: number;
}
```

---

## API Design Patterns

### 1. Streaming Responses

```typescript
// Server-Sent Events для streaming
export async function* streamCompletion(
  prompt: string,
  model: string
): AsyncGenerator<CompletionChunk> {
  const response = await fetch('/api/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      stream: true
    })
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        yield JSON.parse(data);
      }
    }
  }
}
```

### 2. Request Timing Headers

```typescript
// Middleware для добавления timing headers
export function timingMiddleware(handler: Handler): Handler {
  return async (req, res) => {
    const startTime = Date.now() / 1000;

    // Process request
    const result = await handler(req, res);

    const endTime = Date.now() / 1000;

    // Add timing headers
    res.setHeader('X-Goose-Client-Start', startTime.toString());
    res.setHeader('X-Goose-Client-End', endTime.toString());

    return result;
  };
}
```

### 3. Error Handling

```typescript
// Стандартизированный формат ошибок
class APIError extends Error {
  constructor(
    public message: string,
    public type: string,
    public code: string,
    public status: number
  ) {
    super(message);
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        type: this.type,
        code: this.code
      }
    };
  }
}

// Примеры использования
throw new APIError(
  'Insufficient balance',
  'payment_error',
  'insufficient_balance',
  402
);
```

---

## Performance Optimization

### 1. Response Caching

```typescript
import { LRUCache } from 'lru-cache';

const modelCache = new LRUCache<string, ModelInfo>({
  max: 100,
  ttl: 1000 * 60 * 5  // 5 minutes
});

export async function getModels() {
  const cached = modelCache.get('models');
  if (cached) return cached;

  const models = await fetchFromCocoon();
  modelCache.set('models', models);
  return models;
}
```

### 2. Load Balancing

```typescript
// Client-side load balancing на основе worker utilization
function selectBestWorker(model: Model): Worker {
  const workers = model.workers;

  // Найти воркера с наименьшей загрузкой
  return workers.reduce((best, current) => {
    const bestUtil = best.running_requests / best.max_running_requests;
    const currentUtil = current.running_requests / current.max_running_requests;

    return currentUtil < bestUtil ? current : best;
  });
}
```

### 3. HTTP Keep-Alive

```typescript
import ky from 'ky';

const client = ky.extend({
  prefixUrl: 'https://api.cocoon.org',
  keepalive: true,  // Повторное использование соединений
  timeout: 30000
});
```

---

## Security Best Practices

### 1. Rate Limiting

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(60, '1 m'),  // 60 req/min
});

export async function checkRateLimit(userId: string) {
  const { success, remaining } = await ratelimit.limit(userId);

  if (!success) {
    throw new APIError(
      'Rate limit exceeded',
      'rate_limit_error',
      'rate_limit_exceeded',
      429
    );
  }

  return remaining;
}
```

### 2. Input Validation

```typescript
import { z } from 'zod';

const ChatCompletionSchema = z.object({
  model: z.string().min(1),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1).max(10000)
  })).min(1),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().positive().optional()
});

export function validateRequest(data: unknown) {
  return ChatCompletionSchema.parse(data);
}
```

### 3. Authentication

```typescript
import { verifyTelegramWebAppData } from '@telegram-apps/sdk';

export async function authenticateRequest(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new APIError('Missing auth', 'auth_error', 'missing_auth', 401);
  }

  const token = authHeader.slice(7);

  // Verify Telegram init data
  const isValid = verifyTelegramWebAppData(
    token,
    process.env.TELEGRAM_BOT_TOKEN!
  );

  if (!isValid) {
    throw new APIError('Invalid token', 'auth_error', 'invalid_token', 401);
  }

  return parseTelegramUser(token);
}
```

---

## Database Patterns

### 1. Connection Pooling

```typescript
import { PrismaClient } from '@prisma/client';

// Singleton pattern для Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### 2. Transaction Management

```typescript
export async function processPayment(userId: string, amount: number) {
  return prisma.$transaction(async (tx) => {
    // 1. Проверить баланс
    const user = await tx.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.balance < amount) {
      throw new APIError(
        'Insufficient balance',
        'payment_error',
        'insufficient_balance',
        402
      );
    }

    // 2. Списать средства
    await tx.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } }
    });

    // 3. Создать транзакцию
    return tx.transaction.create({
      data: {
        userId,
        amount: -amount,
        type: 'debit',
        description: 'AI request payment'
      }
    });
  });
}
```

---

## Testing Strategies

### 1. Unit Tests

```typescript
import { describe, it, expect } from 'vitest';

describe('calculateCost', () => {
  it('calculates cost correctly', () => {
    const usage = {
      prompt_tokens: 100,
      completion_tokens: 50,
    };

    const pricing = {
      prompt: 150,  // nanoTON per token
      completion: 150
    };

    const cost = calculateCost(usage, pricing);

    expect(cost).toBe({
      prompt_total_cost: 15000,
      completion_total_cost: 7500,
      total_cost: 22500
    });
  });
});
```

### 2. Integration Tests

```typescript
describe('POST /api/v1/chat/completions', () => {
  it('returns completion with cost info', async () => {
    const response = await fetch('/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      },
      body: JSON.stringify({
        model: 'deepseek-v3',
        messages: [{ role: 'user', content: 'Hello' }]
      })
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('usage');
    expect(data.usage).toHaveProperty('total_cost');
    expect(typeof data.usage.total_cost).toBe('number');
  });
});
```

---

## Monitoring & Observability

### 1. Structured Logging

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

export function logRequest(req: Request, duration: number, cost: number) {
  logger.info({
    type: 'api_request',
    method: req.method,
    path: req.url,
    duration_ms: duration,
    cost_nanoton: cost,
    user_id: req.userId
  });
}
```

### 2. Health Checks

```typescript
export async function healthCheck() {
  const checks = await Promise.allSettled([
    checkDatabase(),
    checkCocoon(),
    checkTON()
  ]);

  return {
    status: checks.every(c => c.status === 'fulfilled') ? 'healthy' : 'degraded',
    services: {
      database: checks[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      cocoon: checks[1].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      ton: checks[2].status === 'fulfilled' ? 'healthy' : 'unhealthy'
    },
    timestamp: Date.now()
  };
}
```

---

## Deployment

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."  # Для миграций

# Cocoon
COCOON_API_KEY="..."
COCOON_ENDPOINT="https://api.cocoon.org/v1"

# TON
TON_NETWORK="mainnet"  # или "testnet"
TON_API_KEY="..."

# App
NEXT_PUBLIC_APP_URL="https://goose-ai.vercel.app"
TELEGRAM_BOT_TOKEN="..."

# Monitoring
LOG_LEVEL="info"
SENTRY_DSN="..."
```

### Graceful Shutdown

```typescript
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');

  // Stop accepting new requests
  server.close(() => {
    console.log('HTTP server closed');
  });

  // Close database connections
  await prisma.$disconnect();

  // Wait for existing requests to complete (max 10s)
  await new Promise(resolve => setTimeout(resolve, 10000));

  process.exit(0);
});
```

---

## Code Style

### TypeScript Best Practices

```typescript
// ✅ Используйте explicit types для public API
export interface ChatCompletion {
  id: string;
  choices: Choice[];
  usage: Usage;
}

// ✅ Используйте type guards
function isError(value: unknown): value is Error {
  return value instanceof Error;
}

// ✅ Используйте const assertions
const MODELS = ['deepseek-v3', 'qwen2.5-72b'] as const;
type Model = typeof MODELS[number];

// ❌ Избегайте any
function bad(data: any) { }  // Плохо

// ✅ Используйте unknown + type guard
function good(data: unknown) {
  if (typeof data === 'string') {
    // data is string here
  }
}
```

### React Patterns

```typescript
// ✅ Server Components по умолчанию
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// ✅ Client Components только когда нужно
'use client';

export function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// ✅ Используйте composition
function ChatInterface({ children }: { children: React.ReactNode }) {
  return (
    <div className="chat-container">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
```

---

## References

- [Cocoon GitHub](https://github.com/TelegramMessenger/cocoon)
- [API Reference](./api-reference.md)
- [Architecture](./architecture.md)
- [Next.js Best Practices](https://nextjs.org/docs)
