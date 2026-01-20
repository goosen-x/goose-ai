# Goose AI API Reference

## Overview

Goose AI предоставляет OpenAI-совместимый REST API для взаимодействия с AI моделями через Cocoon Network. Все эндпоинты поддерживают streaming и включают детальную информацию о стоимости и производительности.

**Base URL:** `https://goose-ai.vercel.app/api/v1`

**Backward Compatibility:** Все изменения API поддерживают обратную совместимость

## Authentication

```bash
# Через Telegram Mini App (автоматически)
Authorization: Bearer <telegram_init_data>

# Через API Key (для внешних интеграций)
Authorization: Bearer <api_key>
```

---

## Chat Completions

### POST /v1/chat/completions

Создать completion для чата

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | ID модели (см. [Модели](#models)) |
| `messages` | array | Yes | Массив сообщений чата |
| `max_tokens` | integer | No | Максимум токенов для генерации |
| `temperature` | number | No | Температура семплинга (0-2) |
| `stream` | boolean | No | Включить streaming режим |
| `enable_debug` | boolean | No | Включить debug статистику |

#### Messages Format

```json
{
  "role": "user" | "assistant" | "system",
  "content": "string"
}
```

#### Example Request

```bash
curl -X POST https://goose-ai.vercel.app/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "model": "deepseek-v3",
    "messages": [
      {
        "role": "system",
        "content": "Ты полезный AI-ассистент"
      },
      {
        "role": "user",
        "content": "Привет, как дела?"
      }
    ],
    "temperature": 0.7,
    "enable_debug": true
  }'
```

#### Response Format

```json
{
  "id": "chatcmpl_123",
  "object": "chat.completion",
  "created": 1735567890,
  "model": "deepseek-v3",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Привет! У меня всё отлично, спасибо! Чем могу помочь?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 18,
    "total_tokens": 43,
    "prompt_total_cost": 37500000,
    "completion_total_cost": 27000000,
    "total_cost": 64500000
  }
}
```

#### Streaming Response

Когда `stream: true`, ответ возвращается как Server-Sent Events:

```
data: {"id":"chatcmpl_123","object":"chat.completion.chunk","created":1735567890,"model":"deepseek-v3","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl_123","object":"chat.completion.chunk","created":1735567890,"model":"deepseek-v3","choices":[{"index":0,"delta":{"content":"Привет"},"finish_reason":null}]}

data: {"id":"chatcmpl_123","object":"chat.completion.chunk","created":1735567890,"model":"deepseek-v3","choices":[{"index":0,"delta":{"content":"!"},"finish_reason":null}]}

data: [DONE]
```

#### Debug Headers

Когда `enable_debug: true`, response включает timing headers:

```
X-Goose-Client-Start: 1735567890.123456
X-Goose-Client-End: 1735567891.234567
X-Goose-Cocoon-Start: 1735567890.234567
X-Goose-Cocoon-End: 1735567891.123456
```

---

## Text Completions

### POST /v1/completions

Legacy text completion endpoint (OpenAI-совместимый)

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | ID модели |
| `prompt` | string/array | Yes | Промпт для completion |
| `max_tokens` | integer | No | Максимум токенов |
| `temperature` | number | No | Температура (0-2) |
| `stream` | boolean | No | Streaming режим |

#### Example Request

```bash
curl -X POST https://goose-ai.vercel.app/api/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "model": "deepseek-v3",
    "prompt": "Напиши короткое стихотворение про AI:",
    "max_tokens": 100,
    "temperature": 0.8
  }'
```

---

## Models

### GET /v1/models

Получить список доступных моделей с информацией о нагрузке

#### Response Format

```json
{
  "object": "list",
  "data": [
    {
      "id": "deepseek-v3",
      "object": "model",
      "created": 0,
      "owned_by": "cocoon",
      "capabilities": ["chat", "completion"],
      "pricing": {
        "prompt": 0.15,
        "completion": 0.15,
        "currency": "TON"
      },
      "workers": [
        {
          "coefficient": 100,
          "running_requests": 2,
          "max_running_requests": 10,
          "utilization": 0.2
        }
      ]
    },
    {
      "id": "qwen2.5-72b",
      "object": "model",
      "created": 0,
      "owned_by": "cocoon",
      "capabilities": ["chat", "completion", "summarization"],
      "pricing": {
        "prompt": 0.12,
        "completion": 0.12,
        "currency": "TON"
      },
      "workers": [
        {
          "coefficient": 120,
          "running_requests": 5,
          "max_running_requests": 12,
          "utilization": 0.42
        }
      ]
    }
  ]
}
```

#### Worker Fields

| Field | Description |
|-------|-------------|
| `coefficient` | Ценовой коэффициент воркера (выше = дороже) |
| `running_requests` | Текущее количество активных запросов |
| `max_running_requests` | Максимум одновременных запросов |
| `utilization` | Процент загрузки (0.0-1.0) |

---

## User Balance

### GET /api/user/balance

Получить текущий баланс пользователя

#### Response

```json
{
  "balance": 1.5,
  "currency": "TON",
  "frozen": 0.1,
  "available": 1.4
}
```

### POST /api/user/deposit

Создать invoice для пополнения баланса

#### Request

```json
{
  "amount": 1.0
}
```

#### Response

```json
{
  "invoice_id": "inv_123",
  "payment_url": "ton://transfer/...",
  "qr_code": "data:image/png;base64,...",
  "expires_at": 1735571490
}
```

---

## Health & Monitoring

### GET /api/health

Проверка статуса API

#### Response

```json
{
  "status": "operational",
  "version": "1.0.0",
  "uptime": 86400,
  "services": {
    "database": "healthy",
    "cocoon": "healthy",
    "ton": "healthy"
  }
}
```

---

## Error Handling

Все ошибки возвращаются в формате:

```json
{
  "error": {
    "message": "Invalid API key",
    "type": "authentication_error",
    "code": "invalid_api_key"
  }
}
```

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `invalid_api_key` | 401 | Неверный API ключ |
| `insufficient_balance` | 402 | Недостаточно средств |
| `rate_limit_exceeded` | 429 | Превышен лимит запросов |
| `model_unavailable` | 503 | Модель недоступна |
| `internal_error` | 500 | Внутренняя ошибка сервера |

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/v1/chat/completions` | 60 req/min | Per user |
| `/v1/completions` | 60 req/min | Per user |
| `/v1/models` | 600 req/min | Per IP |
| `/api/user/*` | 120 req/min | Per user |

---

## Pricing

Стоимость вычисляется на основе использованных токенов:

```
Total Cost = (prompt_tokens × prompt_price) + (completion_tokens × completion_price)
```

**Цены в nanoTON:**
- DeepSeek V3: 150 nanoTON/token (≈0.00000015 TON)
- Qwen 2.5 72B: 120 nanoTON/token (≈0.00000012 TON)

**Пример:**
- 100 prompt tokens + 50 completion tokens
- Модель: DeepSeek V3
- Стоимость: (100 × 150) + (50 × 150) = 22,500 nanoTON ≈ 0.0000225 TON

---

## SDKs & Libraries

### JavaScript/TypeScript

```bash
npm install @goose-ai/sdk
```

```typescript
import { GooseAI } from '@goose-ai/sdk';

const goose = new GooseAI({
  apiKey: process.env.GOOSE_API_KEY
});

const response = await goose.chat.completions.create({
  model: 'deepseek-v3',
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

### Python

```bash
pip install goose-ai
```

```python
from goose_ai import GooseAI

client = GooseAI(api_key=os.getenv('GOOSE_API_KEY'))

response = client.chat.completions.create(
    model='deepseek-v3',
    messages=[{'role': 'user', 'content': 'Hello!'}]
)
```

---

## Migration from OpenAI

Goose AI полностью совместим с OpenAI API. Для миграции достаточно изменить base URL:

```diff
- openai.api_base = "https://api.openai.com/v1"
+ openai.api_base = "https://goose-ai.vercel.app/api/v1"
```

---

## References

- [Architecture Documentation](./architecture.md)
- [Development Guide](./development-guide.md)
- [Cocoon Network](https://cocoon.org)
- [TON Documentation](https://docs.ton.org)
