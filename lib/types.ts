export interface User {
  id: string
  email: string
  name: string
  organization: string
}

export interface DetectedObject {
  id: string
  name: string
  brand: string | null
  plasticType: 'PET' | 'HDPE' | 'LDPE' | 'PP' | 'PS' | 'PVC' | 'Other'
  shape: string
  recyclable: boolean
  condition: 'Good' | 'Average' | 'Poor' | 'Critical'
  estimatedWeight: number // in grams
}

export interface AnalysisSummary {
  totalObjects: number
  totalWeight: number
  recyclableWeight: number
  nonRecyclableWeight: number
}

export interface Analysis {
  id: string
  date: string
  location: string
  imageUrl: string
  objects: DetectedObject[]
  summary: AnalysisSummary
  userId: string
}

export interface AISettings {
  plasticBottleWeight: number
  plasticBagWeight: number
  plasticCupWeight: number
}

export interface UserSettings {
  defaultLocation: string
  weightUnit: 'g' | 'kg'
  aiSettings: AISettings
}

export type ObjectType = 'Bottle' | 'Bag' | 'Cup' | 'Container' | 'Wrapper' | 'Other'

export const PLASTIC_TYPES = ['PET', 'HDPE', 'LDPE', 'PP', 'PS', 'PVC', 'Other'] as const
export const CONDITIONS = ['Good', 'Average', 'Poor', 'Critical'] as const
export const OBJECT_TYPES = ['Bottle', 'Bag', 'Cup', 'Container', 'Wrapper', 'Other'] as const
