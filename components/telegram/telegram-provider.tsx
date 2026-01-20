/**
 * Telegram Provider
 *
 * React Context Provider для Telegram SDK
 */

'use client'

import { createContext, useEffect, useState, ReactNode } from 'react'
import { initTelegramSDK, isTelegramEnvironment } from '@/lib/telegram/init'
import { TelegramContextValue, TelegramSDK, TelegramUser } from '@/lib/telegram/types'

// Создаём Context
export const TelegramContext = createContext<TelegramContextValue | null>(null)

interface TelegramProviderProps {
  children: ReactNode
  /**
   * Что показывать, пока SDK инициализируется
   */
  loadingComponent?: ReactNode
  /**
   * Что показывать, если приложение не в Telegram (опционально)
   */
  notInTelegramComponent?: ReactNode
}

/**
 * Loading компонент по умолчанию
 */
function DefaultLoadingComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-1rem">
        <div className="h-2rem w-2rem animate-spin rounded-full border-0.25rem border-primary border-t-transparent" />
        <p className="text-muted-foreground">Загрузка Telegram...</p>
      </div>
    </div>
  )
}

/**
 * Компонент ошибки по умолчанию
 */
function DefaultNotInTelegramComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-1.5rem">
      <div className="flex max-w-md flex-col gap-1rem rounded-lg border border-border bg-card p-1.5rem text-center">
        <div className="text-4xl">🚫</div>
        <h1 className="text-2xl font-bold text-foreground">Приложение недоступно</h1>
        <p className="text-muted-foreground">
          Это приложение работает только внутри Telegram. Пожалуйста, откройте его через Telegram
          Mini App.
        </p>
        <div className="mt-1rem flex flex-col gap-0.5rem text-sm text-muted-foreground">
          <p>Чтобы открыть приложение:</p>
          <ol className="list-inside list-decimal text-left">
            <li>Откройте Telegram</li>
            <li>Найдите бота @{process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'your_bot'}</li>
            <li>Нажмите на кнопку меню внизу</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

/**
 * Telegram Provider - обёртка для приложения
 */
export function TelegramProvider({
  children,
  loadingComponent,
  notInTelegramComponent
}: TelegramProviderProps) {
  const [sdk, setSDK] = useState<TelegramSDK | null>(null)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isInTelegram, setIsInTelegram] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Проверка окружения
    if (!isTelegramEnvironment()) {
      setIsInTelegram(false)
      setIsReady(true)
      setError(new Error('Not in Telegram environment'))
      return
    }

    // Инициализация SDK
    const result = initTelegramSDK()

    if (result.error || !result.sdk) {
      console.error('[TelegramProvider] Initialization failed:', result.error)
      setError(result.error)
      setIsInTelegram(false)
      setIsReady(true)
      return
    }

    // Успешная инициализация
    setSDK(result.sdk)
    setUser(result.sdk.initData.user || null)
    setIsInTelegram(true)
    setIsReady(true)

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('[TelegramProvider] Initialized', {
        user: result.sdk.initData.user,
        viewport: {
          height: result.sdk.viewport.height,
          isExpanded: result.sdk.viewport.isExpanded
        }
      })
    }
  }, [])

  // Состояние загрузки
  if (!isReady) {
    return <>{loadingComponent || <DefaultLoadingComponent />}</>
  }

  // Всё готово, рендерим приложение (работает и в Telegram, и в браузере)
  const contextValue: TelegramContextValue = {
    sdk,
    user,
    isReady,
    isInTelegram,
    error
  }

  return <TelegramContext.Provider value={contextValue}>{children}</TelegramContext.Provider>
}
