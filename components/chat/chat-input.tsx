"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useRef, useEffect } from "react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    handleSubmit(e);
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2 items-end">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={handleInputChange}
        placeholder="Введите сообщение..."
        disabled={isLoading}
        className="min-h-[2.5rem] max-h-32 resize-none"
        rows={1}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e as any);
          }
        }}
      />
      <Button
        type="submit"
        disabled={isLoading || !input.trim()}
        size="icon"
        className="shrink-0 cursor-pointer"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
