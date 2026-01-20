import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Message } from "ai/react";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%] mb-4",
        isUser ? "ml-auto flex-row-reverse" : ""
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        {isUser ? (
          <AvatarFallback className="bg-primary text-primary-foreground">
            U
          </AvatarFallback>
        ) : (
          <>
            <AvatarImage src="/goose-avatar.png" alt="Goose AI" />
            <AvatarFallback className="bg-secondary">G</AvatarFallback>
          </>
        )}
      </Avatar>

      <div
        className={cn(
          "rounded-2xl px-4 py-2.5",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
}
