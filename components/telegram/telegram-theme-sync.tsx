/**
 * Telegram Theme Sync
 *
 * Только viewport sync, без применения Telegram темы
 */

'use client'

import { useEffect } from 'react'
import { useTelegramViewport } from '@/lib/telegram/hooks'

/**
 * Компонент для синхронизации viewport Telegram
 * Не применяет цвета - только тёмная тема из CSS
 */
export function TelegramThemeSync() {
  const { height, stableHeight } = useTelegramViewport()

  // Sync viewport CSS variables to fix hydration mismatch
  useEffect(() => {
    if (height) {
      document.documentElement.style.setProperty('--tg-viewport-height', `${height}px`)
    }
    if (stableHeight) {
      document.documentElement.style.setProperty('--tg-viewport-stable-height', `${stableHeight}px`)
    }
  }, [height, stableHeight])

  // Этот компонент не рендерит UI
  return null
}
