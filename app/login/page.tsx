'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Leaf, Scan, Recycle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const success = await login(email, password)
    
    if (success) {
      router.push('/dashboard')
    } else {
      setError('Invalid email or password. Password must be at least 6 characters.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Leaf className="absolute top-20 left-20 w-8 h-8 text-accent/30 animate-bounce" style={{ animationDelay: '0s' }} />
        <Recycle className="absolute top-40 right-32 w-10 h-10 text-accent/20 animate-bounce" style={{ animationDelay: '0.5s' }} />
        <Scan className="absolute bottom-32 left-32 w-6 h-6 text-accent/25 animate-bounce" style={{ animationDelay: '1s' }} />
        <Leaf className="absolute bottom-20 right-20 w-8 h-8 text-accent/30 animate-bounce" style={{ animationDelay: '1.5s' }} />
      </div>

      <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur-xl border-0 shadow-2xl">
        <CardHeader className="text-center pb-2">
          {/* Logo */}
          <div className="mx-auto mb-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <Scan className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            BLUE EcoScan
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            AI-Powered Waste Analysis for Environmental Research
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="member@blue-ngo.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </Field>
              
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-11"
                />
              </Field>
            </FieldGroup>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>

            <button
              type="button"
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => alert('Please contact your administrator to reset your password.')}
            >
              Forgot password?
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
