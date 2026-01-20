/**
 * Telegram Authentication API
 *
 * POST endpoint для валидации Telegram initData
 */

import { NextRequest, NextResponse } from 'next/server'
import { validateTelegramInitData, createSessionToken } from '@/lib/telegram/validate'

/**
 * POST /api/telegram-auth
 *
 * Валидирует Telegram initData и возвращает информацию о пользователе
 * Опционально создаёт session token для избежания повторной валидации
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { initData } = body

    if (!initData) {
      return NextResponse.json({ error: 'initData is required' }, { status: 400 })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      console.error('[Telegram Auth] TELEGRAM_BOT_TOKEN not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Валидируем initData
    const validation = await validateTelegramInitData(initData, botToken)

    if (!validation.valid) {
      console.warn('[Telegram Auth] Validation failed:', validation.error)
      return NextResponse.json(
        {
          error: 'Invalid Telegram data',
          details: validation.error
        },
        { status: 401 }
      )
    }

    // Успешная валидация
    const user = validation.user

    if (!user) {
      return NextResponse.json({ error: 'User data not found' }, { status: 400 })
    }

    // Создаём session token (опционально)
    const sessionToken = createSessionToken(user.id)

    // Debug logging в development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Telegram Auth] User authenticated:', {
        id: user.id,
        firstName: user.firstName,
        username: user.username
      })
    }

    // Возвращаем данные пользователя и session token
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        photoUrl: user.photoUrl,
        isPremium: user.isPremium,
        languageCode: user.languageCode
      },
      sessionToken,
      authDate: validation.authDate
    })
  } catch (error) {
    console.error('[Telegram Auth] Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/telegram-auth
 *
 * Проверяет, настроен ли Telegram bot (для отладки)
 */
export async function GET() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME

  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  return NextResponse.json({
    configured: !!botToken,
    botUsername: botUsername || 'Not set',
    message: botToken ? 'Bot token is configured' : 'Bot token is missing'
  })
}
