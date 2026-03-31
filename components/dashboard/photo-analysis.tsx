'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Camera, Upload, Scan, X, ImageIcon } from 'lucide-react'
import type { DetectedObject, AnalysisSummary } from '@/lib/types'
import { analyzeWaste, generateStats } from '@/utils/waste-intelligence'

interface PhotoAnalysisProps {
  onAnalysisComplete: (objects: DetectedObject[], summary: AnalysisSummary, imageUrl: string) => void
  isAnalyzing: boolean
  setIsAnalyzing: (value: boolean) => void
}

export function PhotoAnalysis({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }: PhotoAnalysisProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!imagePreview || !selectedFile) return
    
    setIsAnalyzing(true)
    try {
      // Create FormData and send to API
      const formData = new FormData()
      formData.append('image', selectedFile)
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Analysis failed')
      }
      
      const apiResponse = await response.json()
      
      // Transform predictions into enriched data
      const objects = analyzeWaste(apiResponse.predictions)
      const summary = generateStats(objects)
      
      onAnalysisComplete(objects, summary, imagePreview)
    } catch (error) {
      console.error('[v0] Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [imagePreview, selectedFile, onAnalysisComplete, setIsAnalyzing])

  const clearImage = () => {
    setImagePreview(null)
    setSelectedFile(null)
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
          disabled={!imagePreview || !selectedFile || isAnalyzing}
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
