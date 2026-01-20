/**
 * Telegram SDK Initialization
 *
 * Инициализация Telegram Mini App SDK с проверкой окружения
 */

import { TelegramSDK, TelegramInitData } from './types'

/**
 * Проверяет, запущено ли приложение в Telegram
 */
export function isTelegramEnvironment(): boolean {
  if (typeof window === 'undefined') return false
  return !!(window as any).Telegram?.WebApp
}

/**
 * Получает Telegram WebApp объект
 */
function getTelegramWebApp() {
  if (typeof window === 'undefined') return null
  return (window as any).Telegram?.WebApp
}

/**
 * Инициализирует Telegram SDK
 * @returns Объект с SDK и статусом инициализации
 */
export function initTelegramSDK(): {
  sdk: TelegramSDK | null
  isInTelegram: boolean
  error: Error | null
} {
  try {
    // Проверка SSR
    if (typeof window === 'undefined') {
      return {
        sdk: null,
        isInTelegram: false,
        error: new Error('SSR environment')
      }
    }

    const webApp = getTelegramWebApp()

    if (!webApp) {
      return {
        sdk: null,
        isInTelegram: false,
        error: new Error('Telegram WebApp не найден. Приложение работает только в Telegram.')
      }
    }

    // Вызов ready для сигнала Telegram что приложение готово
    webApp.ready()

    // Расширить viewport на максимум
    webApp.expand()

    // Включить подтверждение при закрытии
    webApp.enableClosingConfirmation?.()

    // Парсинг initData
    const initDataRaw = webApp.initData || ''
    const initDataUnsafe = webApp.initDataUnsafe || {}

    const initData: TelegramInitData = {
      user: initDataUnsafe.user
        ? {
            id: initDataUnsafe.user.id,
            firstName: initDataUnsafe.user.first_name,
            lastName: initDataUnsafe.user.last_name,
            username: initDataUnsafe.user.username,
            photoUrl: initDataUnsafe.user.photo_url,
            isPremium: initDataUnsafe.user.is_premium,
            languageCode: initDataUnsafe.user.language_code
          }
        : undefined,
      authDate: initDataUnsafe.auth_date || Date.now() / 1000,
      hash: initDataUnsafe.hash || '',
      queryId: initDataUnsafe.query_id,
      chatType: initDataUnsafe.chat_type,
      chatInstance: initDataUnsafe.chat_instance,
      startParam: initDataUnsafe.start_param
    }

    // Собираем SDK объект
    const sdk: TelegramSDK = {
      initData,
      themeParams: {
        bgColor: webApp.themeParams.bg_color || '#ffffff',
        textColor: webApp.themeParams.text_color || '#000000',
        hintColor: webApp.themeParams.hint_color || '#999999',
        linkColor: webApp.themeParams.link_color || '#2678b6',
        buttonColor: webApp.themeParams.button_color || '#2678b6',
        buttonTextColor: webApp.themeParams.button_text_color || '#ffffff',
        secondaryBgColor: webApp.themeParams.secondary_bg_color || '#f4f4f5',
        headerBgColor: webApp.themeParams.header_bg_color,
        accentTextColor: webApp.themeParams.accent_text_color,
        sectionBgColor: webApp.themeParams.section_bg_color,
        sectionHeaderTextColor: webApp.themeParams.section_header_text_color,
        subtitleTextColor: webApp.themeParams.subtitle_text_color,
        destructiveTextColor: webApp.themeParams.destructive_text_color
      },
      viewport: {
        height: webApp.viewportHeight || window.innerHeight,
        stableHeight: webApp.viewportStableHeight || window.innerHeight,
        isExpanded: webApp.isExpanded || false,
        expand: () => webApp.expand(),
        onChange: (callback) => {
          const handler = () => {
            callback({
              height: webApp.viewportHeight || window.innerHeight,
              stableHeight: webApp.viewportStableHeight || window.innerHeight,
              isExpanded: webApp.isExpanded || false
            })
          }
          webApp.onEvent?.('viewportChanged', handler)
          return () => webApp.offEvent?.('viewportChanged', handler)
        }
      },
      backButton: {
        show: () => webApp.BackButton?.show(),
        hide: () => webApp.BackButton?.hide(),
        onClick: (callback) => {
          webApp.BackButton?.onClick(callback)
          return () => webApp.BackButton?.offClick(callback)
        }
      },
      mainButton: {
        show: () => webApp.MainButton?.show(),
        hide: () => webApp.MainButton?.hide(),
        setText: (text) => {
          if (webApp.MainButton) {
            webApp.MainButton.text = text
          }
        },
        onClick: (callback) => {
          webApp.MainButton?.onClick(callback)
          return () => webApp.MainButton?.offClick(callback)
        },
        showProgress: (leaveActive) => webApp.MainButton?.showProgress(leaveActive),
        hideProgress: () => webApp.MainButton?.hideProgress(),
        enable: () => webApp.MainButton?.enable(),
        disable: () => webApp.MainButton?.disable()
      },
      hapticFeedback: {
        impactOccurred: (style) => webApp.HapticFeedback?.impactOccurred(style),
        notificationOccurred: (type) => webApp.HapticFeedback?.notificationOccurred(type),
        selectionChanged: () => webApp.HapticFeedback?.selectionChanged()
      },
      miniApp: {
        expand: () => webApp.expand(),
        close: () => webApp.close(),
        enableClosingConfirmation: () => webApp.enableClosingConfirmation?.(),
        disableClosingConfirmation: () => webApp.disableClosingConfirmation?.()
      },
      isReady: true
    }

    // Debug logging в development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Telegram SDK] Initialized', {
        user: initData.user,
        theme: sdk.themeParams,
        viewport: {
          height: sdk.viewport.height,
          stableHeight: sdk.viewport.stableHeight
        }
      })
    }

    return {
      sdk,
      isInTelegram: true,
      error: null
    }
  } catch (error) {
    console.error('[Telegram SDK] Initialization error:', error)
    return {
      sdk: null,
      isInTelegram: false,
      error: error as Error
    }
  }
}

/**
 * Получает initData строку для отправки на сервер
 */
export function getInitDataString(): string | null {
  const webApp = getTelegramWebApp()
  return webApp?.initData || null
}
