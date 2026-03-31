import type { DetectedObject, AnalysisSummary } from '@/lib/types'

interface RoboflowPrediction {
  x: number
  y: number
  width: number
  height: number
  confidence: number
  class: string
}

interface RoboflowResponse {
  predictions: RoboflowPrediction[]
}

export function analyzeWaste(predictions: RoboflowPrediction[]): DetectedObject[] {
  return predictions.map(prediction => {
    const name = extractName(prediction.class)
    const plasticType = getPlasticType(prediction.class)
    const recyclable = isRecyclable(prediction.class)
    const weight = estimateWeight(prediction.width, prediction.height, prediction.class)
    const state = estimateState(prediction.confidence)
    const impact = estimateImpact(recyclable, weight, state)

    return {
      id: crypto.randomUUID(),
      name,
      brand: extractBrand(prediction.class),
      plasticType,
      shape: extractShape(prediction.class),
      recyclable,
      condition: state,
      estimatedWeight: weight,
      impact,
    }
  })
}

function extractName(className: string): string {
  const nameMap: Record<string, string> = {
    'Transparent Plastic Bottle': 'Plastic Water Bottle',
    'Plastic Bag': 'Shopping Bag',
    'Plastic Cup': 'Plastic Cup',
    'Plastic Container': 'Food Container',
    'Plastic Bottle': 'Plastic Bottle',
    'PET Bottle': 'PET Bottle',
    'HDPE Container': 'HDPE Container'
  }
  return nameMap[className] || className
}

function extractBrand(className: string): string | null {
  const brandKeywords = ['Coca-Cola', 'Pepsi', 'Nestle', 'Danone', 'Awa']
  const found = brandKeywords.find(brand => className.toLowerCase().includes(brand.toLowerCase()))
  return found || null
}

function extractShape(className: string): string {
  if (className.toLowerCase().includes('bottle')) return 'Bottle'
  if (className.toLowerCase().includes('bag')) return 'Bag'
  if (className.toLowerCase().includes('cup')) return 'Cup'
  if (className.toLowerCase().includes('container')) return 'Container'
  return 'Other'
}

function getPlasticType(className: string): 'PET' | 'HDPE' | 'LDPE' | 'PP' | 'PS' | 'PVC' | 'Other' {
  const classLower = className.toLowerCase()
  
  if (classLower.includes('pet') || classLower.includes('bottle')) return 'PET'
  if (classLower.includes('hdpe') || classLower.includes('container')) return 'HDPE'
  if (classLower.includes('ldpe') || classLower.includes('bag')) return 'LDPE'
  if (classLower.includes('pp') || classLower.includes('cup')) return 'PP'
  if (classLower.includes('ps')) return 'PS'
  if (classLower.includes('pvc')) return 'PVC'
  
  return 'Other'
}

function isRecyclable(className: string): boolean {
  const nonRecyclableClasses = ['plastic bag', 'wrapper', 'film']
  const classLower = className.toLowerCase()
  
  return !nonRecyclableClasses.some(nonRecyclable => classLower.includes(nonRecyclable))
}

function estimateWeight(width: number, height: number, className: string): number {
  const area = width * height
  const classLower = className.toLowerCase()
  
  let baseWeight = 0
  
  if (classLower.includes('bottle')) {
    baseWeight = Math.max(10, Math.min(50, area / 1000))
  } else if (classLower.includes('bag')) {
    baseWeight = Math.max(2, Math.min(15, area / 2000))
  } else if (classLower.includes('cup')) {
    baseWeight = Math.max(5, Math.min(25, area / 1500))
  } else if (classLower.includes('container')) {
    baseWeight = Math.max(15, Math.min(100, area / 800))
  } else {
    baseWeight = Math.max(5, Math.min(50, area / 1200))
  }
  
  return Math.round(baseWeight)
}

function estimateState(confidence: number): 'Good' | 'Average' | 'Poor' | 'Critical' {
  if (confidence >= 0.9) return 'Good'
  if (confidence >= 0.75) return 'Average'
  if (confidence >= 0.6) return 'Poor'
  return 'Critical'
}

function estimateImpact(recyclable: boolean, weight: number, state: 'Good' | 'Average' | 'Poor' | 'Critical'): string {
  if (recyclable && state === 'Good') {
    return 'Low environmental impact - can be recycled efficiently'
  } else if (recyclable && state === 'Average') {
    return 'Moderate environmental impact - recyclable with proper processing'
  } else if (recyclable) {
    return 'High environmental impact - recycling may be difficult due to condition'
  } else if (weight < 10) {
    return 'Low environmental impact - small non-recyclable item'
  } else if (weight < 30) {
    return 'Moderate environmental impact - medium non-recyclable item'
  } else {
    return 'High environmental impact - large non-recyclable item contributing to waste'
  }
}

export function generateStats(objects: DetectedObject[]): AnalysisSummary {
  const totalObjects = objects.length
  const totalWeight = objects.reduce((sum, obj) => sum + obj.estimatedWeight, 0)
  const recyclableWeight = objects
    .filter(obj => obj.recyclable)
    .reduce((sum, obj) => sum + obj.estimatedWeight, 0)
  const nonRecyclableWeight = totalWeight - recyclableWeight

  return {
    totalObjects,
    totalWeight,
    recyclableWeight,
    nonRecyclableWeight,
  }
}
