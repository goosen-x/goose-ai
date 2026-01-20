/**
 * Telegram Mini App Types
 *
 * TypeScript типы для работы с Telegram SDK
 */

export interface TelegramUser {
  id: number
  firstName: string
  lastName?: string
  username?: string
  photoUrl?: string
  isPremium?: boolean
  languageCode?: string
}

export interface TelegramTheme {
  bgColor: string
  textColor: string
  hintColor: string
  linkColor: string
  buttonColor: string
  buttonTextColor: string
  secondaryBgColor: string
  headerBgColor?: string
  accentTextColor?: string
  sectionBgColor?: string
  sectionHeaderTextColor?: string
  subtitleTextColor?: string
  destructiveTextColor?: string
}

export interface TelegramViewport {
  height: number
  stableHeight: number
  isExpanded: boolean
}

export interface TelegramInitData {
  user?: TelegramUser
  authDate: number
  hash: string
  queryId?: string
  chatType?: string
  chatInstance?: string
  startParam?: string
}

export interface TelegramSDK {
  initData: TelegramInitData
  themeParams: TelegramTheme
  viewport: {
    height: number
    stableHeight: number
    isExpanded: boolean
    expand: () => void
    onChange: (callback: (viewport: TelegramViewport) => void) => () => void
  }
  backButton: {
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => () => void
  }
  mainButton: {
    show: () => void
    hide: () => void
    setText: (text: string) => void
    onClick: (callback: () => void) => () => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
    enable: () => void
    disable: () => void
  }
  hapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  miniApp: {
    expand: () => void
    close: () => void
    enableClosingConfirmation: () => void
    disableClosingConfirmation: () => void
  }
  isReady: boolean
}

export interface TelegramContextValue {
  sdk: TelegramSDK | null
  user: TelegramUser | null
  isReady: boolean
  isInTelegram: boolean
  error: Error | null
}
