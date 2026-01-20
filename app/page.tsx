"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect } from "react";
import {
  useTelegramViewport,
  useTelegramBackButton,
  useTelegramHaptic,
  useTelegramMiniApp,
  useIsInTelegram,
} from "@/lib/telegram/hooks";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  // Telegram hooks
  const isInTelegram = useIsInTelegram();
  const { height } = useTelegramViewport();
  const { show: showBackButton, onClick: onBackClick } = useTelegramBackButton();
  const { impactLight, notificationSuccess, notificationError } = useTelegramHaptic();
  const { close } = useTelegramMiniApp();

  // Настройка back button (только в Telegram)
  useEffect(() => {
    if (!isInTelegram) return;

    showBackButton();
    const unsubscribe = onBackClick(() => {
      // При нажатии на кнопку Назад закрываем Mini App
      close();
    });

    return unsubscribe;
  }, [isInTelegram, showBackButton, onBackClick, close]);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);

    if (!hasText) {
      return;
    }

    // Haptic feedback при отправке (только в Telegram)
    if (isInTelegram) {
      impactLight();
    }

    sendMessage({ text: message.text || "" });
    setInput("");

    // Haptic успеха после отправки (только в Telegram)
    if (isInTelegram) {
      setTimeout(() => {
        notificationSuccess();
      }, 100);
    }
  };

  return (
    <div
      className="flex flex-col"
      style={isInTelegram && height ? { height: `${height}px` } : { height: "calc(100vh - 4rem)" }}
    >
      {/* Header - показываем только в браузере */}
      {!isInTelegram && (
        <header className="flex items-center justify-between border-b px-4 py-3">
          <h1 className="text-lg font-semibold">Goose AI 🦆</h1>
          <span className="text-sm text-muted-foreground">Beta</span>
        </header>
      )}

      {/* Conversation */}
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="👋 Привет!"
              description="Я Goose AI. Задайте мне любой вопрос."
            />
          ) : (
            messages.map((message) => (
              <div key={message.id}>
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <Message key={`${message.id}-${i}`} from={message.role}>
                        <MessageContent>
                          <MessageResponse>{part.text}</MessageResponse>
                        </MessageContent>
                      </Message>
                    );
                  }
                  return null;
                })}
              </div>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Input */}
      <PromptInput onSubmit={handleSubmit} className="m-4">
        <PromptInputBody>
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder="Введите сообщение..."
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit disabled={!input && !status} status={status} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
