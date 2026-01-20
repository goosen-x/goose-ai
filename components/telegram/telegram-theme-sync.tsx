/**
 * Telegram Theme Sync
 *
 * Синхронизация темы Telegram с CSS переменными приложения
 */

'use client'

import { useEffect } from 'react'
import { useTelegramTheme, useTelegramViewport } from '@/lib/telegram/hooks'
import { applyTelegramTheme } from '@/lib/telegram/theme'

/**
 * Компонент для синхронизации темы Telegram
 * Применяет цвета из Telegram к CSS переменным приложения
 */
export function TelegramThemeSync() {
  const themeParams = useTelegramTheme()
  const { height, stableHeight } = useTelegramViewport()

  useEffect(() => {
    if (!themeParams) return

    // Применяем тему Telegram к CSS
    applyTelegramTheme(themeParams)

    // Всегда используем тёмную тему
    document.documentElement.classList.add('dark')

    // Debug logging в development
    if (process.env.NODE_ENV === 'development') {
      console.log('[TelegramThemeSync] Theme applied (dark mode forced):', {
        colors: {
          bg: themeParams.bgColor,
          text: themeParams.textColor,
          button: themeParams.buttonColor
        }
      })
    }
  }, [themeParams])

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
