import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-[85%] mb-4">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src="/goose-avatar.png" alt="Goose AI" />
        <AvatarFallback className="bg-secondary">G</AvatarFallback>
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
