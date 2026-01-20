/**
 * Telegram Theme Conversion
 *
 * Конвертация цветов Telegram (RGB/HEX) в OKLCH для применения к CSS переменным
 */

import { formatHex, formatCss, oklch, parse } from 'culori'
import { TelegramTheme } from './types'

/**
 * Конвертирует HEX или RGB цвет в OKLCH строку для CSS
 */
function toOKLCH(color: string): string {
  try {
    // Парсим входной цвет (поддержка HEX, RGB, и т.д.)
    const parsed = parse(color)
    if (!parsed) return color

    // Конвертируем в OKLCH
    const oklchColor = oklch(parsed)
    if (!oklchColor) return color

    // Форматируем для CSS
    return formatCss(oklchColor)
  } catch (error) {
    console.warn('[Theme] Failed to convert color:', color, error)
    return color
  }
}

/**
 * Извлекает только значения (L, C, H) из OKLCH строки для CSS переменных
 * Пример: "oklch(0.5 0.1 180)" -> "0.5 0.1 180"
 */
function extractOKLCHValues(oklchString: string): string {
  const match = oklchString.match(/oklch\(([\d.\s]+)\)/)
  return match ? match[1] : oklchString
}

/**
 * Конвертирует тему Telegram в CSS переменные с OKLCH цветами
 */
export function convertTelegramThemeToCSS(telegramTheme: TelegramTheme): Record<string, string> {
  const cssVars: Record<string, string> = {}

  // Основные цвета
  cssVars['--background'] = extractOKLCHValues(toOKLCH(telegramTheme.bgColor))
  cssVars['--foreground'] = extractOKLCHValues(toOKLCH(telegramTheme.textColor))

  // Карточки и вторичные фоны
  cssVars['--card'] = extractOKLCHValues(
    toOKLCH(telegramTheme.secondaryBgColor || telegramTheme.bgColor)
  )
  cssVars['--card-foreground'] = extractOKLCHValues(toOKLCH(telegramTheme.textColor))

  // Popover
  cssVars['--popover'] = extractOKLCHValues(
    toOKLCH(telegramTheme.secondaryBgColor || telegramTheme.bgColor)
  )
  cssVars['--popover-foreground'] = extractOKLCHValues(toOKLCH(telegramTheme.textColor))

  // Primary (кнопки)
  cssVars['--primary'] = extractOKLCHValues(toOKLCH(telegramTheme.buttonColor))
  cssVars['--primary-foreground'] = extractOKLCHValues(toOKLCH(telegramTheme.buttonTextColor))

  // Secondary
  cssVars['--secondary'] = extractOKLCHValues(
    toOKLCH(telegramTheme.secondaryBgColor || telegramTheme.bgColor)
  )
  cssVars['--secondary-foreground'] = extractOKLCHValues(toOKLCH(telegramTheme.textColor))

  // Muted
  cssVars['--muted'] = extractOKLCHValues(
    toOKLCH(telegramTheme.secondaryBgColor || telegramTheme.bgColor)
  )
  cssVars['--muted-foreground'] = extractOKLCHValues(toOKLCH(telegramTheme.hintColor))

  // Accent
  cssVars['--accent'] = extractOKLCHValues(
    toOKLCH(telegramTheme.accentTextColor || telegramTheme.linkColor)
  )
  cssVars['--accent-foreground'] = extractOKLCHValues(toOKLCH(telegramTheme.textColor))

  // Destructive
  if (telegramTheme.destructiveTextColor) {
    cssVars['--destructive'] = extractOKLCHValues(toOKLCH(telegramTheme.destructiveTextColor))
    cssVars['--destructive-foreground'] = extractOKLCHValues(toOKLCH(telegramTheme.buttonTextColor))
  }

  // Border
  cssVars['--border'] = extractOKLCHValues(toOKLCH(telegramTheme.hintColor))

  // Input
  cssVars['--input'] = extractOKLCHValues(toOKLCH(telegramTheme.hintColor))

  // Ring (focus outline)
  cssVars['--ring'] = extractOKLCHValues(toOKLCH(telegramTheme.linkColor))

  // Дополнительные переменные для Telegram
  cssVars['--tg-link'] = extractOKLCHValues(toOKLCH(telegramTheme.linkColor))
  cssVars['--tg-hint'] = extractOKLCHValues(toOKLCH(telegramTheme.hintColor))

  if (telegramTheme.headerBgColor) {
    cssVars['--tg-header-bg'] = extractOKLCHValues(toOKLCH(telegramTheme.headerBgColor))
  }

  if (telegramTheme.sectionBgColor) {
    cssVars['--tg-section-bg'] = extractOKLCHValues(toOKLCH(telegramTheme.sectionBgColor))
  }

  if (telegramTheme.subtitleTextColor) {
    cssVars['--tg-subtitle'] = extractOKLCHValues(toOKLCH(telegramTheme.subtitleTextColor))
  }

  // Viewport height для динамической высоты
  if (typeof window !== 'undefined') {
    const webApp = (window as any).Telegram?.WebApp
    if (webApp) {
      cssVars['--tg-viewport-height'] = `${webApp.viewportHeight || window.innerHeight}px`
      cssVars['--tg-viewport-stable-height'] = `${
        webApp.viewportStableHeight || window.innerHeight
      }px`
    }
  }

  return cssVars
}

/**
 * Применяет Telegram тему к документу
 */
export function applyTelegramTheme(telegramTheme: TelegramTheme): void {
  if (typeof document === 'undefined') return

  const cssVars = convertTelegramThemeToCSS(telegramTheme)

  // Применяем переменные к :root
  Object.entries(cssVars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value)
  })

  // Добавляем класс для дополнительных переопределений
  document.documentElement.classList.add('telegram-theme')

  // Debug logging в development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Theme] Applied Telegram theme:', cssVars)
  }
}

/**
 * Удаляет Telegram тему
 */
export function removeTelegramTheme(): void {
  if (typeof document === 'undefined') return

  document.documentElement.classList.remove('telegram-theme')

  // Можно также очистить переменные, но обычно они переопределятся при следующем применении
}

/**
 * Определяет, использует ли Telegram тёмную тему
 */
export function isTelegramDarkTheme(theme: TelegramTheme): boolean {
  try {
    // Парсим цвет фона
    const bgColor = parse(theme.bgColor)
    if (!bgColor) return false

    // Конвертируем в OKLCH и проверяем lightness
    const oklchColor = oklch(bgColor)
    if (!oklchColor) return false

    // Если lightness < 0.5, считаем тёмной темой
    return (oklchColor.l || 0) < 0.5
  } catch {
    // Fallback: проверяем по HEX
    const hex = theme.bgColor.replace('#', '')
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness < 128
    }
    return false
  }
}
