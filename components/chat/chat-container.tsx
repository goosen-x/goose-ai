"use client";

import { useChat } from "ai/react";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { TypingIndicator } from "./typing-indicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

export function ChatContainer() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-background">
        <h1 className="text-lg font-semibold">Goose AI 🦆</h1>
        <span className="text-sm text-muted-foreground">Beta</span>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="py-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-center">
              <div className="space-y-2">
                <p className="text-2xl">👋</p>
                <p className="text-muted-foreground">
                  Привет! Я Goose AI. Задайте мне любой вопрос.
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isLoading && <TypingIndicator />}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t px-4 py-3 bg-background">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
