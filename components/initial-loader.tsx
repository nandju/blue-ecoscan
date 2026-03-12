'use client'

import { useEffect, useState } from 'react'
import { Droplets, Leaf } from 'lucide-react'

const LOADER_SHOWN_KEY = 'blue-ecoscan-loader-shown'

export function InitialLoader({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(false)

  useEffect(() => {
    const hasSeenLoader = sessionStorage.getItem(LOADER_SHOWN_KEY)
    
    if (hasSeenLoader) {
      setShowLoader(false)
      return
    }

    setIsFirstVisit(true)
    sessionStorage.setItem(LOADER_SHOWN_KEY, 'true')

    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 2200)

    const hideTimer = setTimeout(() => {
      setShowLoader(false)
    }, 2700)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!showLoader) {
    return <>{children}</>
  }

  if (!isFirstVisit) {
    return <>{children}</>
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-primary via-primary to-accent transition-opacity duration-500 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex flex-col items-center gap-6">
          {/* Logo Animation */}
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary-foreground/20" style={{ animationDuration: '1.5s' }} />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary-foreground/10 backdrop-blur-sm">
              <div className="flex items-center gap-1">
                <Droplets className="h-10 w-10 text-primary-foreground animate-pulse" />
                <Leaf className="h-8 w-8 text-primary-foreground animate-pulse" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>

          {/* Brand Name */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-primary-foreground">
              BLUE EcoScan
            </h1>
            <p className="mt-2 text-sm text-primary-foreground/80">
              AI-Powered Waste Analysis
            </p>
          </div>

          {/* Loading Indicator */}
          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 w-2 animate-bounce rounded-full bg-primary-foreground" style={{ animationDelay: '0ms' }} />
            <div className="h-2 w-2 animate-bounce rounded-full bg-primary-foreground" style={{ animationDelay: '150ms' }} />
            <div className="h-2 w-2 animate-bounce rounded-full bg-primary-foreground" style={{ animationDelay: '300ms' }} />
          </div>

          {/* Progress Bar */}
          <div className="mt-2 h-1 w-48 overflow-hidden rounded-full bg-primary-foreground/20">
            <div 
              className="h-full rounded-full bg-primary-foreground transition-all duration-[2000ms] ease-out"
              style={{ width: fadeOut ? '100%' : '0%', transition: 'width 2s ease-out' }}
            />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-8 text-center text-xs text-primary-foreground/60">
          Protecting our oceans, one scan at a time
        </div>
      </div>
      <div className="opacity-0">{children}</div>
    </>
  )
}
