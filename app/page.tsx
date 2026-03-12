'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Spinner } from '@/components/ui/spinner'

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/80 to-accent">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="w-8 h-8 text-primary-foreground" />
        <p className="text-primary-foreground font-medium">Loading BLUE EcoScan...</p>
      </div>
    </div>
  )
}
