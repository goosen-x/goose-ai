'use client';

import { useTelegramUser } from '@/lib/telegram/hooks';

export function Header() {
  const user = useTelegramUser();

  return (
    <header className="flex shrink-0 items-center justify-between border-b bg-background px-4 py-3">
      <h1 className="text-lg font-semibold">Goose AI 🦆</h1>
      <div className="flex items-center gap-2">
        {user && (
          <span className="text-sm text-muted-foreground">
            {user.firstName}
          </span>
        )}
        <span className="text-sm text-muted-foreground">Beta</span>
      </div>
    </header>
  );
}
