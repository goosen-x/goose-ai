'use client';

import { useTelegramUser } from '@/lib/telegram/hooks';
import { GooseIcon } from '@/components/ui/goose-icon';

export function Header() {
  const user = useTelegramUser();

  return (
    <header className="flex shrink-0 items-center justify-between border-b bg-background px-4 py-2">
      <div className="flex items-center gap-2">
        <GooseIcon className="h-8 w-8" />
        <div>
          <h1 className="text-sm font-semibold leading-tight">Goose AI</h1>
          <span className="text-xs text-muted-foreground">Beta</span>
        </div>
      </div>
      {user && (
        <span className="text-sm text-muted-foreground">
          {user.firstName}
        </span>
      )}
    </header>
  );
}
