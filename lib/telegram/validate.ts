/**
 * Telegram Init Data Validation
 *
 * Server-side валидация данных инициализации Telegram
 * КРИТИЧНО ДЛЯ БЕЗОПАСНОСТИ: всегда валидируйте initData на сервере!
 */

import { validate, parse } from '@tma.js/init-data-node'

export interface ValidationResult {
  valid: boolean
  user?: {
    id: number
    firstName: string
    lastName?: string
    username?: string
    photoUrl?: string
    isPremium?: boolean
    languageCode?: string
  }
  authDate?: number
  error?: string
}

/**
 * Валидирует Telegram initData строку на сервере
 *
 * @param initDataString - Raw init data строка от клиента
 * @param botToken - Токен бота из @BotFather
 * @param expiresIn - Время жизни данных в секундах (по умолчанию 24 часа)
 * @returns Результат валидации
 */
export async function validateTelegramInitData(
  initDataString: string,
  botToken: string,
  expiresIn: number = 86400 // 24 часа
): Promise<ValidationResult> {
  try {
    if (!initDataString) {
      return {
        valid: false,
        error: 'Init data is empty'
      }
    }

    if (!botToken) {
      return {
        valid: false,
        error: 'Bot token is not configured'
      }
    }

    // Валидация HMAC подписи
    try {
      validate(initDataString, botToken, { expiresIn })
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Validation failed'
      }
    }

    // Парсинг валидных данных
    const initData = parse(initDataString)

    if (!initData) {
      return {
        valid: false,
        error: 'Failed to parse init data'
      }
    }

    // Извлечение пользователя
    const user = initData.user
      ? {
          id: initData.user.id,
          firstName: initData.user.firstName,
          lastName: initData.user.lastName,
          username: initData.user.username,
          photoUrl: initData.user.photoUrl,
          isPremium: initData.user.isPremium,
          languageCode: initData.user.languageCode
        }
      : undefined

    return {
      valid: true,
      user,
      authDate: initData.authDate ? initData.authDate.getTime() / 1000 : undefined
    }
  } catch (error) {
    console.error('[Telegram Validation] Error:', error)
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown validation error'
    }
  }
}

/**
 * Middleware для проверки Telegram auth в API routes
 *
 * Пример использования:
 * ```typescript
 * export async function POST(req: Request) {
 *   const validation = await validateTelegramRequest(req)
 *   if (!validation.valid) {
 *     return Response.json({ error: 'Unauthorized' }, { status: 401 })
 *   }
 *   // Ваш код с validation.user
 * }
 * ```
 */
export async function validateTelegramRequest(req: Request): Promise<ValidationResult> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN

  if (!botToken) {
    return {
      valid: false,
      error: 'TELEGRAM_BOT_TOKEN not configured'
    }
  }

  // Попытка извлечь initData из headers
  const initDataFromHeader = req.headers.get('X-Telegram-Init-Data')

  if (initDataFromHeader) {
    return validateTelegramInitData(initDataFromHeader, botToken)
  }

  // Попытка извлечь из body (для POST запросов)
  try {
    const body = await req.json()
    const initDataFromBody = body.initData

    if (initDataFromBody) {
      return validateTelegramInitData(initDataFromBody, botToken)
    }
  } catch {
    // Если не удалось распарсить body, продолжаем
  }

  return {
    valid: false,
    error: 'No init data found in request'
  }
}

/**
 * Создаёт простой session token на основе Telegram user ID
 * (для избежания повторной валидации на каждый запрос)
 *
 * ВАЖНО: Это упрощённая реализация. Для production используйте JWT с подписью.
 */
export function createSessionToken(userId: number): string {
  const timestamp = Date.now()
  const data = `${userId}:${timestamp}`

  // В production используйте JWT или подобное решение с криптографией
  return Buffer.from(data).toString('base64')
}

/**
 * Парсит session token
 */
export function parseSessionToken(token: string): { userId: number; timestamp: number } | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [userIdStr, timestampStr] = decoded.split(':')

    const userId = parseInt(userIdStr, 10)
    const timestamp = parseInt(timestampStr, 10)

    if (isNaN(userId) || isNaN(timestamp)) {
      return null
    }

    // Проверка срока действия (например, 7 дней)
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 дней в миллисекундах
    if (Date.now() - timestamp > maxAge) {
      return null
    }

    return { userId, timestamp }
  } catch {
    return null
  }
}
