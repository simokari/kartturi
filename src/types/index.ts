export type View = 'map' | 'browse' | 'compare'

export type PhaseId =
  | 'suunnittelu'
  | 'toteutus'
  | 'review'
  | 'testaus'
  | 'julkaisu'
  | 'seuranta'

export interface Phase {
  id: PhaseId
  name: string
  description: string
}

export type Confidence = 'verified' | 'estimated'

export interface PricingTier {
  tier: string
  price: string
}

export interface Pricing {
  subscription: PricingTier[]
  api?: { input: string; output: string }
  notes?: string
}

export interface Links {
  docs: string
  pricing?: string
  home?: string
}

export interface Model {
  id: string
  name: string
  vendor: string
  latestVersion: string
  releaseDate: string
  category: string
  phases: PhaseId[]
  strengths: string[]
  limitations: string[]
  contextWindow: string
  pricing: Pricing
  bestFor: string[]
  links: Links
  lastUpdated: string
  source: string
  confidence: Confidence
}

export interface Tool {
  id: string
  name: string
  vendor: string
  type: string
  purpose: string
  phases: PhaseId[]
  integrations: string[]
  worksWith: string[]
  strengths: string[]
  limitations: string[]
  pricing: Pricing
  bestFor: string[]
  links: Links
  lastUpdated: string
  source: string
  confidence: Confidence
}
