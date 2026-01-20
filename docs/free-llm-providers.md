# Бесплатные LLM API провайдеры

Список бесплатных API для использования в Goose AI (актуально на январь 2026).

## Рекомендуемые провайдеры

### 1. Groq (Рекомендуется)

**Почему выбрать:**
- Очень быстрый inference благодаря собственному LPU железу
- OpenAI-совместимый API (легко интегрировать)
- Отличная производительность для чат-приложений

**Лимиты:**
- Бесплатный tier: 200K токенов/день
- Developer tier: 500K токенов/день

**Доступные модели:**
- Llama 3.1 (8B, 70B)
- Llama 3.3 (70B)
- Gemma 2 (9B, 27B)
- Mixtral 8x7B

**Получить ключ:** https://console.groq.com/

**Интеграция:**
```typescript
const provider = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const result = streamText({
  model: provider('llama-3.3-70b-versatile'),
  messages,
});
```

---

### 2. Together AI

**Особенности:**
- Большая коллекция open-source моделей
- Конкурентные цены
- Хороший бесплатный tier

**Доступные модели:**
- Llama 3.1/3.3
- Mixtral
- Qwen 2.5
- DeepSeek Coder

**Получить ключ:** https://together.ai/

---

### 3. Google AI Studio

**Особенности:**
- Бесплатный доступ к Gemini моделям
- Щедрые rate limits
- Официальная поддержка Google

**Доступные модели:**
- Gemini 1.5 Flash
- Gemini 1.5 Pro
- Gemini 2.0 Flash

**Получить ключ:** https://aistudio.google.com/

---

### 4. Hugging Face Inference API

**Особенности:**
- Тысячи доступных моделей
- Простая интеграция
- Бесплатный tier с лимитами

**Получить ключ:** https://huggingface.co/settings/tokens

---

### 5. Cloudflare Workers AI

**Особенности:**
- Бесплатный tier
- Интеграция с Cloudflare ecosystem
- Низкая задержка

**Получить ключ:** https://dash.cloudflare.com/

---

### 6. OpenRouter

**Особенности:**
- Агрегатор разных провайдеров
- Единый API для множества моделей
- Гибкая маршрутизация запросов

**Получить ключ:** https://openrouter.ai/

---

## Лучшие open-source модели (январь 2026)

### Для чата и инструкций:
- **Llama 3.3 70B** - универсальная, отличное качество
- **Llama 3.1 8B** - быстрая, легкая
- **Mixtral 8x7B** - хороший баланс скорости и качества
- **Qwen 2.5 (7B/14B/72B)** - отличная для многоязычности
- **Gemma 2 (9B/27B)** - от Google, хорошая производительность

### Для кода:
- **DeepSeek Coder** - специализирована на коде
- **Qwen2.5 Coder** - отличная для программирования
- **Codestral** - от Mistral AI
- **Llama 4 Scout/Maverick** - новые версии с улучшенным кодингом

### Лидер января 2026:
- **GLM-4.7 (Thinking)** - лучшая в бенчмарках
  - Coding: 89%
  - Reasoning: 95%
  - Полностью бесплатная для скачивания и использования

---

## Настройка в Goose AI

### Способ 1: Через .env файл

```bash
# .env.local
GROQ_API_KEY=your_groq_api_key_here
AI_API_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=llama-3.3-70b-versatile
```

### Способ 2: Через переменные окружения Vercel

В Vercel Dashboard → Settings → Environment Variables добавить:
- `GROQ_API_KEY`
- `AI_API_BASE_URL`
- `AI_MODEL`

---

## Сравнение провайдеров

| Провайдер | Скорость | Лимиты | Модели | OpenAI-совместимый |
|-----------|----------|--------|--------|-------------------|
| Groq | ⭐⭐⭐⭐⭐ | 200K/день | Llama, Gemma, Mixtral | ✅ |
| Together AI | ⭐⭐⭐⭐ | Средние | Множество | ✅ |
| Google AI Studio | ⭐⭐⭐ | Щедрые | Gemini | ❌ |
| HuggingFace | ⭐⭐⭐ | Ограничены | Тысячи | Зависит |
| Cloudflare | ⭐⭐⭐⭐ | Средние | Ограничены | Частично |
| OpenRouter | ⭐⭐⭐ | Зависит | Все | ✅ |

---

## Источники

- [15 Free LLM APIs You Can Use in 2026](https://www.analyticsvidhya.com/blog/2026/01/top-free-llm-apis/)
- [30+ Free and Open Source LLM APIs for Developers](https://apidog.com/blog/free-open-source-llm-apis/)
- [9 Best Free LLM APIs for Developers in 2026](https://visionvix.com/best-free-llm-api/)
- [Groq Llama-3-Tool-Use Models](https://groq.com/blog/introducing-llama-3-groq-tool-use-models)
- [Get access to all Top Open Source Models With GROQ](https://medium.com/@nisarg.nargund/get-access-to-all-top-open-source-models-with-groq-5d29fb06ae7e)
- [Best Open Source LLMs January 2026](https://whatllm.org/blog/best-open-source-models-january-2026)

---

## Следующие шаги

1. Зарегистрироваться на Groq: https://console.groq.com/
2. Получить API ключ
3. Добавить в `.env.local`:
   ```bash
   GROQ_API_KEY=gsk_...
   ```
4. Обновить `app/api/chat/route.ts` для использования Groq
