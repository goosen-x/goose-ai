# Goose AI - UI Architecture

Telegram Mini App для чата с AI. Документ описывает архитектуру UI, структуру страниц, компоненты и wireframes.

## 1. Резюме проекта

Goose AI - мобильный AI-ассистент, работающий внутри Telegram как Mini App. Пользователи общаются с AI, оплачивая запросы в TON. Ключевые функции: чат с AI, история разговоров, управление балансом и настройки.

Особенности:
- Mobile-first дизайн (Telegram Mini App viewport)
- Оплата через TON Connect
- Real-time отображение стоимости запросов
- Минималистичный интерфейс в стиле Telegram

---

## 2. Архитектура

### 2.1 Слои приложения

```
app/                    # Next.js App Router - страницы и layouts
components/
  ui/                   # shadcn/ui компоненты
  chat/                 # Компоненты чата
  balance/              # Компоненты баланса и транзакций
  history/              # Компоненты истории чатов
  shared/               # Общие компоненты (навигация, layouts)
lib/
  utils.ts              # Утилиты (cn, форматирование)
  validators/           # Zod схемы валидации
  api/                  # API клиенты
  telegram/             # Telegram Mini App SDK интеграция
  ton/                  # TON Connect интеграция
hooks/                  # React хуки
  use-telegram.ts       # Хук для Telegram Mini App
  use-ton-connect.ts    # Хук для TON Connect
  use-chat.ts           # Хук для управления чатом
types/                  # TypeScript типы
```

### 2.2 Используемые пакеты

| Пакет | Назначение |
|-------|------------|
| `@telegram-apps/sdk-react` | Telegram Mini App SDK |
| `@tonconnect/ui-react` | TON Connect для платежей |
| `ai` | Vercel AI SDK для streaming |
| `zod` | Валидация данных |
| `date-fns` | Форматирование дат |

### 2.3 Особенности Telegram Mini App

- **Viewport**: Адаптивный, контролируется Telegram
- **Safe Areas**: Учёт notch и system UI
- **Theme**: Синхронизация с темой Telegram
- **Back Button**: Управление через Telegram SDK
- **Main Button**: Использование для основных действий
- **Haptic Feedback**: Тактильная обратная связь

---

## 3. Структура проекта

```
app/
├── layout.tsx                 # Root layout с providers
├── page.tsx                   # Главная - Chat
├── globals.css                # Глобальные стили
├── loading.tsx                # Global loading state
├── error.tsx                  # Global error boundary
├── history/
│   ├── page.tsx               # История чатов
│   └── [chatId]/
│       └── page.tsx           # Конкретный чат из истории
├── balance/
│   ├── page.tsx               # Баланс и транзакции
│   └── topup/
│       └── page.tsx           # Пополнение баланса
└── settings/
    └── page.tsx               # Настройки

components/
├── ui/                        # shadcn/ui (существующие + новые)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   ├── scroll-area.tsx        # NEW
│   ├── avatar.tsx             # NEW
│   ├── skeleton.tsx           # NEW
│   ├── tabs.tsx               # NEW
│   ├── spinner.tsx            # NEW
│   ├── badge.tsx
│   └── select.tsx
├── chat/
│   ├── chat-container.tsx     # Контейнер чата
│   ├── message-list.tsx       # Список сообщений
│   ├── message-bubble.tsx     # Пузырь сообщения
│   ├── chat-input.tsx         # Поле ввода
│   ├── typing-indicator.tsx   # Индикатор печати
│   └── cost-display.tsx       # Отображение стоимости
├── balance/
│   ├── balance-card.tsx       # Карточка баланса
│   ├── transaction-list.tsx   # Список транзакций
│   ├── transaction-item.tsx   # Элемент транзакции
│   └── topup-button.tsx       # Кнопка пополнения
├── history/
│   ├── chat-list.tsx          # Список чатов
│   ├── chat-item.tsx          # Элемент списка
│   ├── search-input.tsx       # Поиск по истории
│   └── date-filter.tsx        # Фильтр по дате
├── settings/
│   ├── model-select.tsx       # Выбор модели AI
│   ├── theme-toggle.tsx       # Переключатель темы
│   └── user-info.tsx          # Информация о пользователе
└── shared/
    ├── bottom-nav.tsx         # Нижняя навигация
    ├── page-header.tsx        # Заголовок страницы
    ├── telegram-provider.tsx  # Telegram SDK provider
    └── ton-provider.tsx       # TON Connect provider

lib/
├── utils.ts
├── validators/
│   ├── message.ts             # Схема сообщения
│   └── transaction.ts         # Схема транзакции
├── telegram/
│   ├── init.ts                # Инициализация Mini App
│   ├── theme.ts               # Синхронизация темы
│   └── haptic.ts              # Haptic feedback
├── ton/
│   ├── connect.ts             # TON Connect config
│   └── payment.ts             # Платёжные функции
└── api/
    ├── chat.ts                # Chat API client
    └── balance.ts             # Balance API client

hooks/
├── use-telegram.ts
├── use-ton-connect.ts
├── use-chat.ts
├── use-balance.ts
└── use-mobile.ts              # shadcn hook

types/
├── message.ts
├── chat.ts
├── transaction.ts
└── user.ts
```

---

## 4. Маршруты Next.js

| Путь | Тип | Назначение | Особенности |
|------|-----|------------|-------------|
| `/` | Статический | Главный экран чата | Default, chat interface |
| `/history` | Статический | Список чатов | С поиском и фильтрами |
| `/history/[chatId]` | Динамический | Просмотр чата | Read-only режим |
| `/balance` | Статический | Баланс и транзакции | TON Connect |
| `/balance/topup` | Статический | Пополнение | TON payment flow |
| `/settings` | Статический | Настройки | Model selection, theme |

### Layout структура

```
RootLayout (app/layout.tsx)
├── TelegramProvider
├── TonConnectProvider
├── ThemeProvider
└── children
    └── BottomNav (fixed bottom)
```

---

## 5. Перечень страниц и сценарии

### 5.1 Главная (Chat) - `/`

**Функции:**
- Отправка сообщений AI
- Просмотр ответов в реальном времени (streaming)
- Отображение стоимости запроса до отправки
- Typing indicator при ожидании ответа
- Сохранение контекста разговора

**Сценарии:**
1. Пользователь открывает приложение - видит пустой чат или продолжение
2. Вводит сообщение - видит примерную стоимость
3. Отправляет - видит typing indicator
4. Получает ответ - streaming текста
5. При недостаточном балансе - предложение пополнить

### 5.2 История - `/history`

**Функции:**
- Список всех предыдущих чатов
- Поиск по содержимому
- Фильтрация по дате
- Просмотр и продолжение чата

**Сценарии:**
1. Просмотр списка чатов с превью
2. Поиск по ключевым словам
3. Фильтр по периоду (сегодня, неделя, месяц)
4. Tap на чат - переход к просмотру

### 5.3 Баланс - `/balance`

**Функции:**
- Отображение текущего баланса в TON
- История транзакций
- Кнопка пополнения

**Сценарии:**
1. Просмотр баланса
2. Просмотр истории списаний/пополнений
3. Tap "Пополнить" - переход к пополнению

### 5.4 Пополнение - `/balance/topup`

**Функции:**
- Выбор суммы пополнения
- TON Connect авторизация
- Проведение платежа

**Сценарии:**
1. Выбор суммы (пресеты или ввод)
2. Подключение кошелька (TON Connect)
3. Подтверждение и оплата
4. Успех/ошибка с редиректом

### 5.5 Настройки - `/settings`

**Функции:**
- Выбор модели AI (GPT-4, Claude, etc.)
- Переключение темы (sync with Telegram)
- Информация о пользователе
- Выход из аккаунта

---

## 6. Компоненты shadcn/ui

### 6.1 Существующие (уже установлены)

| Компонент | Роль |
|-----------|------|
| `Button` | Все кнопки (отправка, пополнение, навигация) |
| `Card` | Карточки баланса, чатов в истории |
| `Input` | Поля ввода (поиск) |
| `Textarea` | Поле ввода сообщения |
| `Badge` | Статусы, метки стоимости |
| `Select` | Выбор модели AI |
| `Separator` | Разделители в списках |
| `Label` | Подписи к полям |
| `DropdownMenu` | Контекстные меню |
| `AlertDialog` | Подтверждения действий |

### 6.2 Требуется установить

| Компонент | Роль |
|-----------|------|
| `ScrollArea` | Скролл списка сообщений |
| `Avatar` | Аватары AI и пользователя |
| `Skeleton` | Loading states |
| `Tabs` | Фильтры в истории |
| `Spinner` | Индикатор загрузки |

```bash
# Команда установки недостающих компонентов
pnpm dlx shadcn@latest add scroll-area avatar skeleton tabs spinner
```

### 6.3 Кастомные компоненты

| Компонент | Назначение |
|-----------|------------|
| `MessageBubble` | Стилизованный пузырь сообщения |
| `TypingIndicator` | Анимированные точки "печатает..." |
| `CostDisplay` | Badge с estimated cost |
| `BottomNav` | Мобильная навигация (4 таба) |
| `ChatInput` | Textarea + кнопка отправки |
| `BalanceCard` | Карточка с балансом и графикой TON |
| `TransactionItem` | Строка транзакции |
| `ChatItem` | Превью чата в списке |

---

## 7. ASCII Wireframes

### 7.1 Главная (Chat)

```
┌──────────────────────────────────────┐
│ Goose AI                    0.5 TON  │  <- Header с балансом
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │ [G] Привет! Я Goose AI.       │  │  <- AI message
│  │     Чем могу помочь?          │  │
│  └────────────────────────────────┘  │
│                                      │
│        ┌─────────────────────────┐   │
│        │ Напиши код на Python   [U]│  │  <- User message
│        └─────────────────────────┘   │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ [G] ● ● ●                     │  │  <- Typing indicator
│  └────────────────────────────────┘  │
│                                      │
├──────────────────────────────────────┤
│ ~0.001 TON                           │  <- Cost estimate
│ ┌──────────────────────────────┐ [>] │
│ │ Введите сообщение...         │     │  <- Input + Send
│ └──────────────────────────────┘     │
├──────────────────────────────────────┤
│  [Chat]  [History]  [Balance]  [Set] │  <- Bottom nav
└──────────────────────────────────────┘

Состояния:
- idle: Поле пустое, кнопка неактивна
- typing: Текст введён, кнопка активна, показан cost
- loading: Поле disabled, typing indicator
- error: Toast с ошибкой
```

### 7.2 История чатов

```
┌──────────────────────────────────────┐
│ История                              │
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │
│ │ (Поиск по истории...)        [x]│ │  <- Search input
│ └──────────────────────────────────┘ │
│                                      │
│ [Все] [Сегодня] [Неделя] [Месяц]     │  <- Tabs filter
│ ──────────────────────────────────── │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ Код на Python           19 янв  │ │  <- Chat item
│ │ Напиши функцию сортировки...    │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ Рецепт борща            18 янв  │ │
│ │ Как приготовить классический... │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ Перевод текста          17 янв  │ │
│ │ Переведи на английский...       │ │
│ └──────────────────────────────────┘ │
│                                      │
├──────────────────────────────────────┤
│  [Chat]  [History]  [Balance]  [Set] │
└──────────────────────────────────────┘

Состояния:
- loading: Skeleton карточки (3 шт)
- empty: Иллюстрация + "Нет чатов"
- results: Список карточек
- no-results: "Ничего не найдено"
```

### 7.3 Баланс

```
┌──────────────────────────────────────┐
│ Баланс                               │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │         ◆ 2.45 TON             │  │  <- Balance card
│  │         ≈ $5.23                │  │
│  │                                │  │
│  │       [Пополнить баланс]       │  │  <- Primary action
│  │                                │  │
│  └────────────────────────────────┘  │
│                                      │
│  История транзакций                  │
│  ──────────────────────────────────  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ ↓ Пополнение         +1.0 TON │  │
│  │   19 янв, 14:32               │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ ↑ Chat: Python код   -0.05 TON│  │
│  │   19 янв, 14:15               │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ ↑ Chat: Борщ         -0.02 TON│  │
│  │   18 янв, 12:00               │  │
│  └────────────────────────────────┘  │
│                                      │
├──────────────────────────────────────┤
│  [Chat]  [History]  [Balance]  [Set] │
└──────────────────────────────────────┘

Состояния:
- loading: Skeleton для баланса и списка
- connected: Кошелёк подключён
- disconnected: Кнопка "Подключить кошелёк"
```

### 7.4 Пополнение баланса

```
┌──────────────────────────────────────┐
│ [<] Пополнение                       │  <- Back button
├──────────────────────────────────────┤
│                                      │
│  Выберите сумму                      │
│                                      │
│  ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ 1 TON  │ │ 5 TON  │ │ 10 TON │   │  <- Preset amounts
│  └────────┘ └────────┘ └────────┘   │
│                                      │
│  Или введите свою сумму:             │
│  ┌──────────────────────────────────┐│
│  │ (Сумма в TON)                    ││  <- Custom input
│  └──────────────────────────────────┘│
│                                      │
│  ──────────────────────────────────  │
│                                      │
│  Итого: 5 TON ≈ $10.75               │  <- Summary
│                                      │
│                                      │
│                                      │
│                                      │
│  ┌──────────────────────────────────┐│
│  │      [Оплатить через TON]        ││  <- TON Connect button
│  └──────────────────────────────────┘│
│                                      │
├──────────────────────────────────────┤
│  [Chat]  [History]  [Balance]  [Set] │
└──────────────────────────────────────┘

Состояния:
- idle: Ничего не выбрано, кнопка disabled
- selected: Сумма выбрана, кнопка активна
- connecting: "Подключение кошелька..."
- processing: Spinner + "Обработка платежа..."
- success: Check + "Успешно!" + redirect
- error: Alert + retry button
```

### 7.5 Настройки

```
┌──────────────────────────────────────┐
│ Настройки                            │
├──────────────────────────────────────┤
│                                      │
│  Модель AI                           │
│  ┌──────────────────────────────────┐│
│  │ {Claude 3.5 Sonnet           ▾} ││  <- Model select
│  └──────────────────────────────────┘│
│                                      │
│  ──────────────────────────────────  │
│                                      │
│  Тема оформления                     │
│  ┌──────────────────────────────────┐│
│  │ Как в Telegram        [Switch]  ││  <- Theme toggle
│  │ Светлая               [      ]  ││
│  │ Тёмная                [      ]  ││
│  └──────────────────────────────────┘│
│                                      │
│  ──────────────────────────────────  │
│                                      │
│  Аккаунт                             │
│  ┌──────────────────────────────────┐│
│  │ [Avatar] @username              ││
│  │          Telegram ID: 123456    ││
│  └──────────────────────────────────┘│
│                                      │
│  ──────────────────────────────────  │
│                                      │
│  ┌──────────────────────────────────┐│
│  │     [Отключить кошелёк]          ││  <- Disconnect wallet
│  └──────────────────────────────────┘│
│                                      │
├──────────────────────────────────────┤
│  [Chat]  [History]  [Balance]  [Set] │
└──────────────────────────────────────┘

Состояния:
- loading: Skeleton для всех полей
- loaded: Данные отображены
- saving: Spinner рядом с изменённым полем
```

### 7.6 Bottom Navigation (все экраны)

```
┌──────────────────────────────────────┐
│  ◯        ◯        ●        ◯       │
│ Chat   History  Balance   Settings  │
│                   ^^^                │
│              Active state            │
└──────────────────────────────────────┘

Иконки (lucide-react):
- Chat: MessageSquare
- History: History
- Balance: Wallet
- Settings: Settings
```

---

## 8. Заготовки кода

### 8.1 Root Layout (`app/layout.tsx`)

```typescript
import type { Metadata, Viewport } from "next";
import { Raleway, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TelegramProvider } from "@/components/shared/telegram-provider";
import { TonProvider } from "@/components/shared/ton-provider";
import { BottomNav } from "@/components/shared/bottom-nav";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Goose AI",
  description: "AI-ассистент в Telegram",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${raleway.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-background text-foreground">
        <TelegramProvider>
          <TonProvider>
            <main className="min-h-screen pb-16">
              {children}
            </main>
            <BottomNav />
          </TonProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}
```

### 8.2 Chat Page (`app/page.tsx`)

```typescript
import { ChatContainer } from "@/components/chat/chat-container";

export default function ChatPage() {
  return <ChatContainer />;
}
```

### 8.3 Chat Container (`components/chat/chat-container.tsx`)

```typescript
"use client";

import { useState } from "react";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { CostDisplay } from "./cost-display";
import { useChat } from "@/hooks/use-chat";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatContainer() {
  const { messages, isLoading, sendMessage, estimatedCost } = useChat();
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <h1 className="text-lg font-semibold">Goose AI</h1>
        <span className="text-sm text-muted-foreground">0.5 TON</span>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <MessageList messages={messages} isLoading={isLoading} />
      </ScrollArea>

      {/* Input area */}
      <div className="border-t px-4 py-3 space-y-2">
        {inputValue && <CostDisplay cost={estimatedCost} />}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
```

### 8.4 Message Bubble (`components/chat/message-bubble.tsx`)

```typescript
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageBubbleProps {
  content: string;
  role: "user" | "assistant";
  timestamp?: Date;
}

export function MessageBubble({ content, role, timestamp }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%]",
        isUser ? "ml-auto flex-row-reverse" : ""
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        {isUser ? (
          <AvatarFallback>U</AvatarFallback>
        ) : (
          <>
            <AvatarImage src="/goose-avatar.png" alt="Goose AI" />
            <AvatarFallback>G</AvatarFallback>
          </>
        )}
      </Avatar>

      <div
        className={cn(
          "rounded-2xl px-4 py-2",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <time className="text-xs opacity-50 mt-1 block">
            {timestamp.toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        )}
      </div>
    </div>
  );
}
```

### 8.5 Chat Input (`components/chat/chat-input.tsx`)

```typescript
"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение..."
        disabled={disabled}
        className="min-h-[2.5rem] max-h-32 resize-none"
        rows={1}
      />
      <Button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        size="icon"
        className="shrink-0 cursor-pointer"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

### 8.6 Bottom Navigation (`components/shared/bottom-nav.tsx`)

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MessageSquare, History, Wallet, Settings } from "lucide-react";

const navItems = [
  { href: "/", icon: MessageSquare, label: "Chat" },
  { href: "/history", icon: History, label: "History" },
  { href: "/balance", icon: Wallet, label: "Balance" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t">
      <div className="flex h-full items-center justify-around">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 cursor-pointer",
                "transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

### 8.7 Balance Card (`components/balance/balance-card.tsx`)

```typescript
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BalanceCardProps {
  balance: number;
  usdEquivalent: number;
}

export function BalanceCard({ balance, usdEquivalent }: BalanceCardProps) {
  return (
    <Card>
      <CardContent className="pt-6 text-center space-y-4">
        <div className="space-y-1">
          <p className="text-3xl font-bold">
            <span className="text-primary">◆</span> {balance.toFixed(2)} TON
          </p>
          <p className="text-sm text-muted-foreground">
            ≈ ${usdEquivalent.toFixed(2)}
          </p>
        </div>
        <Button asChild className="w-full cursor-pointer">
          <Link href="/balance/topup">Пополнить баланс</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
```

### 8.8 Typing Indicator (`components/chat/typing-indicator.tsx`)

```typescript
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-[85%]">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src="/goose-avatar.png" alt="Goose AI" />
        <AvatarFallback>G</AvatarFallback>
      </Avatar>

      <div className="rounded-2xl px-4 py-3 bg-muted">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
```

### 8.9 useChat Hook (`hooks/use-chat.ts`)

```typescript
"use client";

import { useState, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // TODO: Implement actual API call with streaming
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  // Estimate cost based on message length
  const calculateCost = useCallback((text: string) => {
    const tokens = Math.ceil(text.length / 4);
    return tokens * 0.00001; // Example rate
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    estimatedCost,
    calculateCost,
  };
}
```

---

## 9. План следующих шагов

### Этап 1: Настройка инфраструктуры
1. Установить недостающие shadcn/ui компоненты
2. Настроить Telegram Mini App SDK
3. Интегрировать TON Connect
4. Создать базовую структуру папок

### Этап 2: Реализация UI
1. Создать BottomNav и базовый layout
2. Реализовать Chat page с компонентами
3. Реализовать History page
4. Реализовать Balance page с TON Connect
5. Реализовать Settings page

### Этап 3: Интеграция API
1. Настроить streaming для chat
2. Реализовать API endpoints
3. Подключить базу данных для истории
4. Реализовать систему оплаты

### Этап 4: Полировка
1. Добавить loading states
2. Добавить error handling
3. Оптимизировать производительность
4. Тестирование в Telegram

---

## Команды установки

```bash
# Установка недостающих shadcn/ui компонентов
pnpm dlx shadcn@latest add scroll-area avatar skeleton tabs spinner

# Установка зависимостей для Telegram и TON
pnpm add @telegram-apps/sdk-react @tonconnect/ui-react

# Установка Vercel AI SDK для streaming
pnpm add ai

# Утилиты
pnpm add zod date-fns
```
