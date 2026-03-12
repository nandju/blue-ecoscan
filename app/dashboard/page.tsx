'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { DashboardHeader } from '@/components/dashboard/header'
import { PhotoAnalysis } from '@/components/dashboard/photo-analysis'
import { AIResults } from '@/components/dashboard/ai-results'
import { Statistics } from '@/components/dashboard/statistics'
import { AnalysisHistory } from '@/components/dashboard/history'
import { Reports } from '@/components/dashboard/reports'
import { Spinner } from '@/components/ui/spinner'
import type { DetectedObject, AnalysisSummary, Analysis } from '@/lib/types'

export default function DashboardPage() {
  const { user, isLoading, analyses, addAnalysis, settings } = useAuth()
  const router = useRouter()
  
  const [currentObjects, setCurrentObjects] = useState<DetectedObject[]>([])
  const [currentSummary, setCurrentSummary] = useState<AnalysisSummary | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const handleAnalysisComplete = (objects: DetectedObject[], summary: AnalysisSummary, imageUrl: string) => {
    setCurrentObjects(objects)
    setCurrentSummary(summary)
    setCurrentImageUrl(imageUrl)

    // Save to history
    const newAnalysis: Analysis = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      location: settings.defaultLocation || 'Unknown location',
      imageUrl,
      objects,
      summary,
      userId: user?.id || '',
    }
    addAnalysis(newAnalysis)
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
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Photo Analysis & Reports */}
          <div className="space-y-6">
            <PhotoAnalysis 
              onAnalysisComplete={handleAnalysisComplete}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
            />
            <Reports 
              objects={currentObjects}
              summary={currentSummary}
              imageUrl={currentImageUrl}
            />
          </div>

          {/* Right Column - AI Results */}
          <div className="space-y-6">
            <AIResults 
              objects={currentObjects}
              summary={currentSummary}
            />
          </div>

          {/* Full Width - Statistics */}
          <div className="lg:col-span-2">
            <Statistics objects={currentObjects} />
          </div>

          {/* Full Width - History */}
          <div className="lg:col-span-2">
            <AnalysisHistory analyses={analyses} />
          </div>
        </div>
      </main>
    </div>
  )
}
