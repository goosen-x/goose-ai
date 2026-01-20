/**
 * Eruda Debugger
 *
 * Компонент для мобильной отладки в development режиме
 */

'use client'

import { useEffect } from 'react'

export function ErudaDebugger() {
  useEffect(() => {
    // Включаем только в development
    if (process.env.NODE_ENV === 'development') {
      // Динамический импорт eruda
      import('eruda').then((eruda) => {
        eruda.default.init()
        console.log('[Eruda] Mobile debugger initialized')
      })
    }
  }, [])

  return null
}
