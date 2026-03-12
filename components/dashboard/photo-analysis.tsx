'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Camera, Upload, Scan, X, ImageIcon } from 'lucide-react'
import type { DetectedObject, AnalysisSummary } from '@/lib/types'

interface PhotoAnalysisProps {
  onAnalysisComplete: (objects: DetectedObject[], summary: AnalysisSummary, imageUrl: string) => void
  isAnalyzing: boolean
  setIsAnalyzing: (value: boolean) => void
}

// Mock AI analysis function - in production this would call a real AI endpoint
async function analyzeImage(): Promise<{ objects: DetectedObject[], summary: AnalysisSummary }> {
  await new Promise(resolve => setTimeout(resolve, 2500))
  
  const mockObjects: DetectedObject[] = [
    {
      id: crypto.randomUUID(),
      name: 'Awa Water Bottle',
      brand: 'Awa',
      plasticType: 'PET',
      shape: 'Bottle',
      recyclable: true,
      condition: 'Average',
      estimatedWeight: 15,
    },
    {
      id: crypto.randomUUID(),
      name: 'Coca-Cola Bottle',
      brand: 'Coca-Cola',
      plasticType: 'PET',
      shape: 'Bottle',
      recyclable: true,
      condition: 'Good',
      estimatedWeight: 18,
    },
    {
      id: crypto.randomUUID(),
      name: 'Shopping Bag',
      brand: null,
      plasticType: 'LDPE',
      shape: 'Bag',
      recyclable: false,
      condition: 'Poor',
      estimatedWeight: 5,
    },
    {
      id: crypto.randomUUID(),
      name: 'Yogurt Cup',
      brand: 'Danone',
      plasticType: 'PP',
      shape: 'Cup',
      recyclable: true,
      condition: 'Average',
      estimatedWeight: 8,
    },
    {
      id: crypto.randomUUID(),
      name: 'Food Container',
      brand: null,
      plasticType: 'HDPE',
      shape: 'Container',
      recyclable: true,
      condition: 'Good',
      estimatedWeight: 25,
    },
  ]

  const recyclableWeight = mockObjects
    .filter(obj => obj.recyclable)
    .reduce((sum, obj) => sum + obj.estimatedWeight, 0)
  
  const totalWeight = mockObjects.reduce((sum, obj) => sum + obj.estimatedWeight, 0)

  return {
    objects: mockObjects,
    summary: {
      totalObjects: mockObjects.length,
      totalWeight,
      recyclableWeight,
      nonRecyclableWeight: totalWeight - recyclableWeight,
    },
  }
}

export function PhotoAnalysis({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }: PhotoAnalysisProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!imagePreview) return
    
    setIsAnalyzing(true)
    try {
      const result = await analyzeImage()
      onAnalysisComplete(result.objects, result.summary, imagePreview)
    } catch (error) {
      console.error('[v0] Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [imagePreview, onAnalysisComplete, setIsAnalyzing])

  const clearImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-primary" />
          Photo Analysis
        </CardTitle>
        <CardDescription>
          Take or upload a photo of collected waste for AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Preview Area */}
        <div className="relative aspect-video w-full bg-muted rounded-xl overflow-hidden border-2 border-dashed border-border/50 flex items-center justify-center">
          {imagePreview ? (
            <>
              <img 
                src={imagePreview} 
                alt="Waste preview" 
                className="w-full h-full object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={clearImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <div className="text-center p-6">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No image selected
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Take a photo or upload an image to analyze
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-12"
            onClick={() => cameraInputRef.current?.click()}
            disabled={isAnalyzing}
          >
            <Camera className="w-4 h-4 mr-2" />
            Take Photo
          </Button>
          <Button
            variant="outline"
            className="h-12"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Analyze Button */}
        <Button
          className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground font-medium"
          onClick={handleAnalyze}
          disabled={!imagePreview || isAnalyzing}
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <Spinner className="w-4 h-4" />
              Analyzing with AI...
            </span>
          ) : (
            <>
              <Scan className="w-4 h-4 mr-2" />
              Analyze Waste
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
