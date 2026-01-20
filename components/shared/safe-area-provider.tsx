'use client';

import { useEffect } from 'react';
import { useTelegramSDK } from '@/lib/telegram/hooks';

export function SafeAreaProvider({ children }: { children: React.ReactNode }) {
  const { sdk } = useTelegramSDK();

  // Get safe area insets from Telegram SDK
  const safeTop = 0; // Telegram SDK doesn't expose safe area yet
  const safeBottom = 0;
  const safeLeft = 0;
  const safeRight = 0;

  useEffect(() => {
    // Set CSS variables for use in other components
    const root = document.documentElement;
    root.style.setProperty('--safe-area-top', `${safeTop}px`);
    root.style.setProperty('--safe-area-bottom', `${safeBottom}px`);
    root.style.setProperty('--safe-area-left', `${safeLeft}px`);
    root.style.setProperty('--safe-area-right', `${safeRight}px`);
  }, [safeTop, safeBottom, safeLeft, safeRight]);

  return (
    <div
      className="flex h-screen flex-col"
      style={{
        paddingTop: safeTop,
        paddingBottom: safeBottom,
        paddingLeft: safeLeft,
        paddingRight: safeRight,
      }}
    >
      {children}
    </div>
  );
}
