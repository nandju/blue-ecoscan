'use client'

import { useEffect } from 'react'

export function PWARegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[v0] SW registered:', registration.scope)
        })
        .catch((error) => {
          console.log('[v0] SW registration failed:', error)
        })
    }
  }, [])

  return null
}
