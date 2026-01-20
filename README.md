# Goose AI 🦆

> AI-powered assistant running on TON blockchain via Cocoon Network

Telegram Mini App для общения с AI моделями через децентрализованную сеть Cocoon с оплатой в TON.

## ✨ Features

- 💬 **Chat with AI** - Общайтесь с мощными AI моделями (DeepSeek V3, Qwen 2.5)
- 🔒 **Private & Secure** - Конфиденциальные вычисления в TEE (Trusted Execution Environment)
- 💰 **Pay-as-you-go** - Оплата только за использованные токены в TON
- ⚡ **Real-time Streaming** - Мгновенные ответы через Server-Sent Events
- 📊 **Cost Transparency** - Детальная информация о стоимости каждого запроса
- 🔄 **OpenAI Compatible** - Полная совместимость с OpenAI API

## 🚀 Quick Start

```bash
# Установить зависимости
pnpm install

# Настроить переменные окружения
cp .env.example .env.local

# Запустить dev сервер
pnpm dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 📚 Documentation

- **[API Reference](./docs/api-reference.md)** - Полная документация API endpoints
- **[Development Guide](./docs/development-guide.md)** - Best practices и паттерны разработки
- **[Architecture](./docs/architecture.md)** - Архитектура приложения и tech stack
- **[Project Plan](./docs/project-plan.md)** - План развития проекта

## 🛠 Tech Stack

### Frontend
- **Next.js 16** - React framework с App Router и Server Components
- **React 19** - Последняя версия React с новыми фичами
- **TypeScript** - Строгая типизация для надежности кода
- **Tailwind CSS v4** - Современный utility-first CSS фреймворк
- **shadcn/ui** - Красивые и доступные UI компоненты (radix-lyra style)

### Backend & Integrations
- **Cocoon Network** - Децентрализованная AI inference платформа
- **TON Blockchain** - Платежи и управление балансом
- **Neon PostgreSQL** - Serverless база данных
- **Prisma** - Type-safe ORM

## 🎯 Usage Example

### JavaScript/TypeScript

```typescript
import { GooseAI } from '@goose-ai/sdk';

const goose = new GooseAI({
  apiKey: process.env.GOOSE_API_KEY
});

// Simple chat completion
const response = await goose.chat.completions.create({
  model: 'deepseek-v3',
  messages: [
    { role: 'system', content: 'You are a helpful assistant' },
    { role: 'user', content: 'Hello!' }
  ]
});

console.log(response.choices[0].message.content);
console.log(`Cost: ${response.usage.total_cost} nanoTON`);
```

### cURL

```bash
curl -X POST https://goose-ai.vercel.app/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "model": "deepseek-v3",
    "messages": [
      {"role": "user", "content": "Explain quantum computing"}
    ],
    "enable_debug": true
  }'
```

## 🔑 Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Cocoon Network
COCOON_API_KEY="..."
COCOON_ENDPOINT="https://api.cocoon.org/v1"

# TON Blockchain
TON_NETWORK="mainnet"
TON_API_KEY="..."

# Application
NEXT_PUBLIC_APP_URL="https://goose-ai.vercel.app"
TELEGRAM_BOT_TOKEN="..."
```

## 📊 Available Models

| Model | Provider | Pricing | Best For |
|-------|----------|---------|----------|
| **DeepSeek V3** | Cocoon | 0.15 nanoTON/token | General chat, coding |
| **Qwen 2.5 72B** | Cocoon | 0.12 nanoTON/token | Multilingual, summarization |

См. [API Reference](./docs/api-reference.md#models) для полного списка моделей.

## 🎨 Key Features

### 1. Debug Mode

Получайте детальную информацию о производительности:

```typescript
const response = await goose.chat.completions.create({
  model: 'deepseek-v3',
  messages: [...],
  enable_debug: true  // Включить debug mode
});

// Response headers включают timing information:
// X-Goose-Client-Start: 1735567890.123
// X-Goose-Client-End: 1735567891.234
// X-Goose-Cocoon-Start: 1735567890.234
// X-Goose-Cocoon-End: 1735567891.123
```

### 2. Cost Tracking

Прозрачная информация о стоимости:

```typescript
{
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 50,
    "total_tokens": 150,
    "prompt_total_cost": 15000000,      // nanoTON
    "completion_total_cost": 7500000,
    "total_cost": 22500000              // = 0.0000225 TON
  }
}
```

### 3. Smart Load Balancing

Автоматический выбор наименее загруженных воркеров:

```typescript
// API автоматически выбирает лучшего воркера
// на основе текущей утилизации
const models = await goose.models.list();

models.data.forEach(model => {
  const bestWorker = model.workers.reduce((best, current) => {
    const bestUtil = best.running_requests / best.max_running_requests;
    const currentUtil = current.running_requests / current.max_running_requests;
    return currentUtil < bestUtil ? current : best;
  });

  console.log(`${model.id}: ${(bestWorker.utilization * 100).toFixed(1)}% utilization`);
});
```

## 🚀 Deployment

### Vercel (Recommended)

1. Подключите GitHub репозиторий к Vercel
2. Добавьте environment variables
3. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgoose-labs%2Fgoose-ai)

### Docker

```bash
# Build
docker build -t goose-ai .

# Run
docker run -p 3000:3000 --env-file .env.local goose-ai
```

## 🧪 Development

```bash
# Run tests
pnpm test

# Type check
pnpm type-check

# Lint
pnpm lint

# Format
pnpm format
```

## 📈 Roadmap

- [x] OpenAI-compatible API
- [x] Cost tracking & transparency
- [x] Debug mode with timing headers
- [ ] Multi-model support (Llama, Claude)
- [ ] Voice input/output
- [ ] Image generation
- [ ] Function calling
- [ ] Fine-tuning support
- [ ] Analytics dashboard

См. [Project Plan](./docs/project-plan.md) для детального roadmap.

## 🤝 Contributing

Contributions are welcome! Please read our [Development Guide](./docs/development-guide.md) first.

```bash
# Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/goose-ai.git

# Create a branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m 'Add amazing feature'

# Push and create a PR
git push origin feature/amazing-feature
```

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🔗 Links

- **Website:** [goose-ai.vercel.app](https://goose-ai.vercel.app)
- **Telegram:** [@goose_ai_bot](https://t.me/goose_ai_bot)
- **Cocoon Network:** [cocoon.org](https://cocoon.org)
- **TON Blockchain:** [ton.org](https://ton.org)
- **API Documentation:** [docs/api-reference.md](./docs/api-reference.md)

---

Made with ❤️ by [Goose Labs](https://github.com/goose-labs) | Powered by [Cocoon Network](https://cocoon.org) & [TON](https://ton.org)
