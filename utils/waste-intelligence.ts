import type { DetectedObject, AnalysisSummary } from '@/lib/types'

interface RoboflowPrediction {
  x: number
  y: number
  width: number
  height: number
  confidence: number
  class: string
}

export function normalizeClassName(name: string): string {
  const map: Record<string, string> = {
    "Transparet Plastic Bottle": "Transparent Plastic Bottle",
    "Plastic Bottle": "Transparent Plastic Bottle",
    "Transparent Plastic Bottle": "Transparent Plastic Bottle",
    "Plastic Bag": "Plastic Bag",
    "Plastic Cup": "Plastic Cup",
    "Plastic Container": "Plastic Container",
  }

  return map[name] || name
}

export function getPlasticType(name: string): 'PET' | 'HDPE' | 'LDPE' | 'PP' | 'PS' | 'PVC' | 'Other' {
  if (name.toLowerCase().includes("bottle")) return "PET"
  if (name.toLowerCase().includes("bag")) return "LDPE"
  if (name.toLowerCase().includes("cup")) return "PP"
  if (name.toLowerCase().includes("container")) return "HDPE"
  return "Other"
}

export function isRecyclable(name: string): boolean {
  return name.toLowerCase().includes("bottle") || name.toLowerCase().includes("container")
}

export function estimateWeight(pred: RoboflowPrediction): number {
  const area = pred.width * pred.height

  if (area > 500000) return 30
  if (area > 200000) return 20
  return 10
}

export function estimateState(confidence: number): 'Good' | 'Average' | 'Poor' | 'Critical' {
  if (confidence > 0.85) return "Good"
  if (confidence > 0.6) return "Average"
  if (confidence > 0.4) return "Poor"
  return "Critical"
}

export function estimateImpact(name: string): string {
  if (name.toLowerCase().includes("bottle")) {
    return "Pollution plastique recyclable, impact modéré"
  }
  if (name.toLowerCase().includes("bag")) {
    return "Fort impact environnemental, non biodégradable"
  }
  if (name.toLowerCase().includes("cup")) {
    return "Impact modéré, recyclable dans certaines conditions"
  }
  if (name.toLowerCase().includes("container")) {
    return "Impact variable, vérifier recyclabilité locale"
  }
  return "Impact environnemental inconnu"
}

export function analyzeWaste(predictions: RoboflowPrediction[]): DetectedObject[] {
  return predictions.map((pred) => {
    const cleanName = normalizeClassName(pred.class)

    return {
      id: crypto.randomUUID(),
      name: cleanName,
      brand: null,
      plasticType: getPlasticType(cleanName),
      shape: extractShape(cleanName),
      recyclable: isRecyclable(cleanName),
      condition: estimateState(pred.confidence),
      estimatedWeight: estimateWeight(pred),
      impact: estimateImpact(cleanName),
    }
  })
}

function extractShape(className: string): string {
  if (className.toLowerCase().includes('bottle')) return 'Bottle'
  if (className.toLowerCase().includes('bag')) return 'Bag'
  if (className.toLowerCase().includes('cup')) return 'Cup'
  if (className.toLowerCase().includes('container')) return 'Container'
  return 'Other'
}

export function generateStats(data: DetectedObject[]): AnalysisSummary {
  const recyclableCount = data.filter(d => d.recyclable).length
  const totalWeight = data.reduce((sum, d) => sum + d.estimatedWeight, 0)
  const recyclableWeight = data
    .filter(d => d.recyclable)
    .reduce((sum, d) => sum + d.estimatedWeight, 0)

  return {
    totalObjects: data.length,
    totalWeight,
    recyclableWeight,
    nonRecyclableWeight: totalWeight - recyclableWeight,
  }
}
