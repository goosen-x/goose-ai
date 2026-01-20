/**
 * Telegram React Hooks
 *
 * React hooks для работы с Telegram SDK
 */

'use client'

import { useContext, useEffect, useState, useCallback } from 'react'
import { TelegramContext } from '@/components/telegram/telegram-provider'
import {
  TelegramUser,
  TelegramTheme,
  TelegramViewport,
  TelegramContextValue
} from './types'

/**
 * Получить Telegram SDK и состояние инициализации
 */
export function useTelegramSDK(): TelegramContextValue {
  const context = useContext(TelegramContext)

  if (!context) {
    throw new Error('useTelegramSDK must be used within TelegramProvider')
  }

  return context
}

/**
 * Получить текущего пользователя Telegram
 */
export function useTelegramUser(): TelegramUser | null {
  const { user } = useTelegramSDK()
  return user
}

/**
 * Получить тему Telegram
 */
export function useTelegramTheme(): TelegramTheme | null {
  const { sdk } = useTelegramSDK()
  return sdk?.themeParams || null
}

/**
 * Получить viewport Telegram с реактивными обновлениями
 */
export function useTelegramViewport(): TelegramViewport {
  const { sdk } = useTelegramSDK()
  const [viewport, setViewport] = useState<TelegramViewport>({
    height: sdk?.viewport.height || (typeof window !== 'undefined' ? window.innerHeight : 0),
    stableHeight:
      sdk?.viewport.stableHeight || (typeof window !== 'undefined' ? window.innerHeight : 0),
    isExpanded: sdk?.viewport.isExpanded || false
  })

  useEffect(() => {
    if (!sdk) return

    // Подписываемся на изменения viewport
    const unsubscribe = sdk.viewport.onChange((newViewport) => {
      setViewport(newViewport)

      // Обновляем CSS переменную
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty(
          '--tg-viewport-height',
          `${newViewport.height}px`
        )
        document.documentElement.style.setProperty(
          '--tg-viewport-stable-height',
          `${newViewport.stableHeight}px`
        )
      }
    })

    return unsubscribe
  }, [sdk])

  return viewport
}

/**
 * Управление кнопкой Назад в Telegram
 */
export function useTelegramBackButton() {
  const { sdk } = useTelegramSDK()

  const show = useCallback(() => {
    sdk?.backButton.show()
  }, [sdk])

  const hide = useCallback(() => {
    sdk?.backButton.hide()
  }, [sdk])

  const onClick = useCallback(
    (callback: () => void) => {
      if (!sdk) return () => {}
      return sdk.backButton.onClick(callback)
    },
    [sdk]
  )

  return { show, hide, onClick }
}

/**
 * Управление главной кнопкой в Telegram
 */
export function useTelegramMainButton() {
  const { sdk } = useTelegramSDK()

  const show = useCallback(() => {
    sdk?.mainButton.show()
  }, [sdk])

  const hide = useCallback(() => {
    sdk?.mainButton.hide()
  }, [sdk])

  const setText = useCallback(
    (text: string) => {
      sdk?.mainButton.setText(text)
    },
    [sdk]
  )

  const onClick = useCallback(
    (callback: () => void) => {
      if (!sdk) return () => {}
      return sdk.mainButton.onClick(callback)
    },
    [sdk]
  )

  const showProgress = useCallback(
    (leaveActive?: boolean) => {
      sdk?.mainButton.showProgress(leaveActive)
    },
    [sdk]
  )

  const hideProgress = useCallback(() => {
    sdk?.mainButton.hideProgress()
  }, [sdk])

  const enable = useCallback(() => {
    sdk?.mainButton.enable()
  }, [sdk])

  const disable = useCallback(() => {
    sdk?.mainButton.disable()
  }, [sdk])

  return {
    show,
    hide,
    setText,
    onClick,
    showProgress,
    hideProgress,
    enable,
    disable
  }
}

/**
 * Haptic Feedback для тактильной обратной связи
 */
export function useTelegramHaptic() {
  const { sdk } = useTelegramSDK()

  const impactLight = useCallback(() => {
    sdk?.hapticFeedback.impactOccurred('light')
  }, [sdk])

  const impactMedium = useCallback(() => {
    sdk?.hapticFeedback.impactOccurred('medium')
  }, [sdk])

  const impactHeavy = useCallback(() => {
    sdk?.hapticFeedback.impactOccurred('heavy')
  }, [sdk])

  const impactRigid = useCallback(() => {
    sdk?.hapticFeedback.impactOccurred('rigid')
  }, [sdk])

  const impactSoft = useCallback(() => {
    sdk?.hapticFeedback.impactOccurred('soft')
  }, [sdk])

  const notificationSuccess = useCallback(() => {
    sdk?.hapticFeedback.notificationOccurred('success')
  }, [sdk])

  const notificationError = useCallback(() => {
    sdk?.hapticFeedback.notificationOccurred('error')
  }, [sdk])

  const notificationWarning = useCallback(() => {
    sdk?.hapticFeedback.notificationOccurred('warning')
  }, [sdk])

  const selectionChanged = useCallback(() => {
    sdk?.hapticFeedback.selectionChanged()
  }, [sdk])

  return {
    impactLight,
    impactMedium,
    impactHeavy,
    impactRigid,
    impactSoft,
    notificationSuccess,
    notificationError,
    notificationWarning,
    selectionChanged
  }
}

/**
 * Управление Mini App (закрытие, expand и т.д.)
 */
export function useTelegramMiniApp() {
  const { sdk } = useTelegramSDK()

  const expand = useCallback(() => {
    sdk?.miniApp.expand()
  }, [sdk])

  const close = useCallback(() => {
    sdk?.miniApp.close()
  }, [sdk])

  const enableClosingConfirmation = useCallback(() => {
    sdk?.miniApp.enableClosingConfirmation()
  }, [sdk])

  const disableClosingConfirmation = useCallback(() => {
    sdk?.miniApp.disableClosingConfirmation()
  }, [sdk])

  return {
    expand,
    close,
    enableClosingConfirmation,
    disableClosingConfirmation
  }
}

/**
 * Проверяет, запущено ли приложение в Telegram
 */
export function useIsInTelegram(): boolean {
  const { isInTelegram } = useTelegramSDK()
  return isInTelegram
}
