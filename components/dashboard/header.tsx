'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Scan, Settings, LogOut, User } from 'lucide-react'
import Link from 'next/link'

export function DashboardHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 backdrop-blur flex items-center justify-center">
            <Scan className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">BLUE EcoScan</span>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">{user?.name || 'User'}</span>
          </div>
          
          <Link href="/settings">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Settings className="w-5 h-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={logout}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="w-5 h-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
