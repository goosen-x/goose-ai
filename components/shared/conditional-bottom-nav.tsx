/**
 * Conditional Bottom Nav
 *
 * Показывает BottomNav только когда НЕ в Telegram
 */

'use client'

import { useIsInTelegram } from '@/lib/telegram/hooks'
import { BottomNav } from './bottom-nav'

export function ConditionalBottomNav() {
  const isInTelegram = useIsInTelegram()

  // В Telegram не показываем BottomNav (используется Telegram Back Button)
  if (isInTelegram) {
    return null
  }

  // В браузере показываем обычную навигацию
  return <BottomNav />
}
