'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Scale, 
  Cpu, 
  Shield, 
  LogOut,
  Save,
  Check
} from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const { user, isLoading, logout, settings, updateSettings } = useAuth()
  const router = useRouter()
  
  const [defaultLocation, setDefaultLocation] = useState(settings.defaultLocation)
  const [weightUnit, setWeightUnit] = useState(settings.weightUnit)
  const [bottleWeight, setBottleWeight] = useState(settings.aiSettings.plasticBottleWeight)
  const [bagWeight, setBagWeight] = useState(settings.aiSettings.plasticBagWeight)
  const [cupWeight, setCupWeight] = useState(settings.aiSettings.plasticCupWeight)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savedMessage, setSavedMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    setDefaultLocation(settings.defaultLocation)
    setWeightUnit(settings.weightUnit)
    setBottleWeight(settings.aiSettings.plasticBottleWeight)
    setBagWeight(settings.aiSettings.plasticBagWeight)
    setCupWeight(settings.aiSettings.plasticCupWeight)
  }, [settings])

  const handleSaveSettings = () => {
    updateSettings({
      defaultLocation,
      weightUnit,
      aiSettings: {
        plasticBottleWeight: bottleWeight,
        plasticBagWeight: bagWeight,
        plasticCupWeight: cupWeight,
      },
    })
    setSavedMessage('Settings saved successfully!')
    setTimeout(() => setSavedMessage(null), 3000)
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }
    // In production, this would call an API endpoint
    alert('Password changed successfully!')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-8 h-8 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/dashboard">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Button>
          </Link>
          <h1 className="font-bold text-lg">Settings</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Success Message */}
        {savedMessage && (
          <div className="bg-accent/20 text-accent border border-accent/30 rounded-lg px-4 py-3 flex items-center gap-2">
            <Check className="w-4 h-4" />
            {savedMessage}
          </div>
        )}

        {/* Profile Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile
            </CardTitle>
            <CardDescription>
              Your account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input value={user.name} disabled className="bg-muted" />
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input value={user.email} disabled className="bg-muted" />
              </Field>
              <Field>
                <FieldLabel>Organization</FieldLabel>
                <Input value={user.organization} disabled className="bg-muted" />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Collection Settings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Collection Settings
            </CardTitle>
            <CardDescription>
              Configure default values for waste collection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="location">Default Location</FieldLabel>
                <Input
                  id="location"
                  placeholder="e.g., Bassam Beach, Abidjan"
                  value={defaultLocation}
                  onChange={(e) => setDefaultLocation(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Weight Units</FieldLabel>
                <div className="flex gap-2">
                  <Button
                    variant={weightUnit === 'g' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setWeightUnit('g')}
                  >
                    Grams (g)
                  </Button>
                  <Button
                    variant={weightUnit === 'kg' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setWeightUnit('kg')}
                  >
                    Kilograms (kg)
                  </Button>
                </div>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              AI Settings
            </CardTitle>
            <CardDescription>
              Adjust average weights used for AI estimates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="bottleWeight">Plastic Bottle Weight (g)</FieldLabel>
                <Input
                  id="bottleWeight"
                  type="number"
                  min={1}
                  value={bottleWeight}
                  onChange={(e) => setBottleWeight(Number(e.target.value))}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="bagWeight">Plastic Bag Weight (g)</FieldLabel>
                <Input
                  id="bagWeight"
                  type="number"
                  min={1}
                  value={bagWeight}
                  onChange={(e) => setBagWeight(Number(e.target.value))}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="cupWeight">Plastic Cup Weight (g)</FieldLabel>
                <Input
                  id="cupWeight"
                  type="number"
                  min={1}
                  value={cupWeight}
                  onChange={(e) => setCupWeight(Number(e.target.value))}
                />
              </Field>
            </FieldGroup>
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              onClick={handleSaveSettings}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>
              Change your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Field>
            </FieldGroup>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleChangePassword}
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Session */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <LogOut className="w-5 h-5" />
              Session
            </CardTitle>
            <CardDescription>
              Sign out of your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
