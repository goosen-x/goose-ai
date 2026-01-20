import { streamText, UIMessage } from 'ai';
import { groq } from '@ai-sdk/groq';
import { validateTelegramRequest } from '@/lib/telegram/validate';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

/**
 * POST /api/chat
 * Chat endpoint using Vercel AI SDK
 * Handles streaming responses from AI models
 */
export async function POST(req: Request) {
  try {
    // Опциональная валидация Telegram (для отслеживания пользователей)
    // В будущем можно сделать обязательной для безопасности
    let telegramUserId: number | undefined;

    const validation = await validateTelegramRequest(req);
    if (validation.valid && validation.user) {
      telegramUserId = validation.user.id;

      if (process.env.NODE_ENV === 'development') {
        console.log('[Chat] Request from Telegram user:', {
          id: validation.user.id,
          username: validation.user.username,
          firstName: validation.user.firstName
        });
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.log('[Chat] Request without valid Telegram auth:', validation.error);
    }

    const body = await req.json();
    const messages: UIMessage[] = body.messages;

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Manually convert UIMessage to ModelMessage format
    const modelMessages = messages.map(msg => {
      const textParts = msg.parts.filter(part => part.type === 'text');
      const content = textParts.map(part => part.text).join('');

      return {
        role: msg.role,
        content: content,
      };
    });

    // Stream the response using AI SDK with Groq
    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      messages: modelMessages,
      temperature: 0.7,
      maxTokens: 2000,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
