import { z } from 'zod'

const PhaseId = z.enum(['suunnittelu', 'toteutus', 'review', 'testaus', 'julkaisu', 'seuranta'])
const Confidence = z.enum(['verified', 'estimated'])

const PricingTier = z.object({
  tier: z.string().min(1),
  price: z.string().min(1),
})

const Pricing = z.object({
  subscription: z.array(PricingTier).min(1),
  api: z.object({ input: z.string(), output: z.string() }).optional(),
  notes: z.string().optional(),
})

const Links = z.object({
  docs: z.string().url(),
  pricing: z.string().url().optional(),
  home: z.string().url().optional(),
})

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

export const PhaseSchema = z.object({
  id: PhaseId,
  name: z.string().min(1),
  description: z.string().min(1),
})

export const ModelSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  vendor: z.string().min(1),
  latestVersion: z.string().min(1),
  releaseDate: z.string().min(1),
  category: z.string().min(1),
  phases: z.array(PhaseId).min(1),
  strengths: z.array(z.string()).min(1),
  limitations: z.array(z.string()).min(1),
  contextWindow: z.string().min(1),
  pricing: Pricing,
  bestFor: z.array(z.string()).min(1),
  links: Links,
  lastUpdated: z.string().regex(dateRegex, 'Muoto: YYYY-MM-DD'),
  source: z.string().url(),
  confidence: Confidence,
})

export const ToolSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  vendor: z.string().min(1),
  type: z.string().min(1),
  purpose: z.string().min(1),
  phases: z.array(PhaseId).min(1),
  integrations: z.array(z.string()),
  worksWith: z.array(z.string()),
  strengths: z.array(z.string()).min(1),
  limitations: z.array(z.string()).min(1),
  pricing: Pricing,
  bestFor: z.array(z.string()).min(1),
  links: Links,
  lastUpdated: z.string().regex(dateRegex, 'Muoto: YYYY-MM-DD'),
  source: z.string().url(),
  confidence: Confidence,
})
