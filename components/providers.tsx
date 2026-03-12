'use client'

import { AuthProvider } from '@/lib/auth-context'
import { PWARegister } from '@/components/pwa-register'
import { InitialLoader } from '@/components/initial-loader'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <PWARegister />
      <InitialLoader>
        {children}
      </InitialLoader>
    </AuthProvider>
  )
}
