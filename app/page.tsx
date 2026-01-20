"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect } from "react";
import {
  useTelegramViewport,
  useTelegramBackButton,
  useTelegramHaptic,
  useTelegramMiniApp,
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
  const { height } = useTelegramViewport();
  const { show: showBackButton, onClick: onBackClick } = useTelegramBackButton();
  const { impactLight, notificationSuccess, notificationError } = useTelegramHaptic();
  const { close } = useTelegramMiniApp();

  // Настройка back button
  useEffect(() => {
    showBackButton();
    const unsubscribe = onBackClick(() => {
      // При нажатии на кнопку Назад закрываем Mini App
      close();
    });

    return unsubscribe;
  }, [showBackButton, onBackClick, close]);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);

    if (!hasText) {
      return;
    }

    // Haptic feedback при отправке
    impactLight();

    sendMessage({ text: message.text || "" });
    setInput("");

    // Haptic успеха после отправки
    setTimeout(() => {
      notificationSuccess();
    }, 100);
  };

  return (
    <div
      className="flex flex-col"
      style={{ height: height ? `${height}px` : "100vh" }}
    >
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
