import { describe, it, expect } from 'vitest'
import type { Model, Tool } from '../types'
import { filterModels, filterTools } from './filters'

// ── Fixtures ─────────────────────────────────────────────────────────────────

function makeModel(overrides: Partial<Model> = {}): Model {
  return {
    id: 'model-a', name: 'Claude Sonnet', vendor: 'Anthropic',
    latestVersion: '1', releaseDate: '2025-01', category: 'koodaus',
    phases: ['suunnittelu', 'toteutus'], strengths: [], limitations: [],
    contextWindow: '200k', pricing: { subscription: [] }, bestFor: [],
    links: { docs: 'https://example.com' },
    lastUpdated: '2025-01-01', source: 'https://example.com', confidence: 'verified',
    ...overrides,
  }
}

function makeTool(overrides: Partial<Tool> = {}): Tool {
  return {
    id: 'tool-a', name: 'Claude Code', vendor: 'Anthropic', type: 'agentic CLI',
    purpose: 'AI-avusteinen koodaus', phases: ['toteutus', 'review'],
    integrations: ['GitHub', 'VS Code'], worksWith: [],
    strengths: [], limitations: [], pricing: { subscription: [] }, bestFor: [],
    links: { docs: 'https://example.com' },
    lastUpdated: '2025-01-01', source: 'https://example.com', confidence: 'verified',
    ...overrides,
  }
}

const MODELS: Model[] = [
  makeModel({ id: 'm1', name: 'Claude Sonnet', vendor: 'Anthropic', phases: ['suunnittelu', 'toteutus'] }),
  makeModel({ id: 'm2', name: 'GPT-4o', vendor: 'OpenAI', phases: ['toteutus', 'testaus'] }),
  makeModel({ id: 'm3', name: 'Gemini Pro', vendor: 'Google', phases: ['suunnittelu'] }),
]

const TOOLS: Tool[] = [
  makeTool({ id: 't1', name: 'Claude Code', vendor: 'Anthropic', phases: ['toteutus', 'review'], integrations: ['GitHub', 'VS Code'] }),
  makeTool({ id: 't2', name: 'Cursor', vendor: 'Anysphere', phases: ['toteutus'], integrations: ['GitHub'] }),
  makeTool({ id: 't3', name: 'Vercel', vendor: 'Vercel', phases: ['julkaisu'], integrations: ['GitHub', 'Vercel'] }),
]

// ── filterModels ──────────────────────────────────────────────────────────────

describe('filterModels', () => {
  describe('query filtering', () => {
    it('returns all when query is empty', () => {
      expect(filterModels(MODELS, '', [])).toHaveLength(3)
    })

    it('matches by model name (case insensitive)', () => {
      const result = filterModels(MODELS, 'claude', [])
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('m1')
    })

    it('matches by vendor name (case insensitive)', () => {
      const result = filterModels(MODELS, 'openai', [])
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('m2')
    })

    it('returns empty when query matches nothing', () => {
      expect(filterModels(MODELS, 'llama', [])).toHaveLength(0)
    })

    it('is case insensitive for both name and vendor', () => {
      expect(filterModels(MODELS, 'GOOGLE', [])).toHaveLength(1)
      expect(filterModels(MODELS, 'GeMiNi', [])).toHaveLength(1)
    })
  })

  describe('phase filtering', () => {
    it('returns all when no phases selected', () => {
      expect(filterModels(MODELS, '', [])).toHaveLength(3)
    })

    it('returns models that include the selected phase', () => {
      const result = filterModels(MODELS, '', ['suunnittelu'])
      expect(result.map((m) => m.id)).toContain('m1')
      expect(result.map((m) => m.id)).toContain('m3')
      expect(result.map((m) => m.id)).not.toContain('m2')
    })

    it('uses OR logic across selected phases', () => {
      const result = filterModels(MODELS, '', ['suunnittelu', 'testaus'])
      expect(result).toHaveLength(3)
    })

    it('returns empty when no models match the phase', () => {
      expect(filterModels(MODELS, '', ['seuranta'])).toHaveLength(0)
    })
  })

  describe('combined query + phase filtering', () => {
    it('applies both filters with AND logic', () => {
      const result = filterModels(MODELS, 'anthropic', ['testaus'])
      expect(result).toHaveLength(0)
    })

    it('returns match when both query and phase match', () => {
      const result = filterModels(MODELS, 'claude', ['suunnittelu'])
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('m1')
    })
  })
})

// ── filterTools ───────────────────────────────────────────────────────────────

describe('filterTools', () => {
  describe('query filtering', () => {
    it('returns all when query is empty', () => {
      expect(filterTools(TOOLS, '', [], [])).toHaveLength(3)
    })

    it('matches by tool name', () => {
      const result = filterTools(TOOLS, 'cursor', [], [])
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('t2')
    })

    it('matches by vendor', () => {
      const result = filterTools(TOOLS, 'vercel', [], [])
      // 'vercel' matches vendor 'Vercel' (t3) and also name 'Vercel' (t3) — 1 result
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('t3')
    })
  })

  describe('phase filtering', () => {
    it('returns tools with any of the selected phases (OR)', () => {
      const result = filterTools(TOOLS, '', ['review'], [])
      expect(result.map((t) => t.id)).toContain('t1')
      expect(result.map((t) => t.id)).not.toContain('t2')
      expect(result.map((t) => t.id)).not.toContain('t3')
    })

    it('returns empty when no tools match the phase', () => {
      expect(filterTools(TOOLS, '', ['testaus'], [])).toHaveLength(0)
    })
  })

  describe('integration filtering', () => {
    it('returns all when no integrations selected', () => {
      expect(filterTools(TOOLS, '', [], [])).toHaveLength(3)
    })

    it('returns tools that include the selected integration', () => {
      const result = filterTools(TOOLS, '', [], ['VS Code'])
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('t1')
    })

    it('uses OR logic across selected integrations', () => {
      const result = filterTools(TOOLS, '', [], ['VS Code', 'Vercel'])
      expect(result.map((t) => t.id)).toContain('t1')
      expect(result.map((t) => t.id)).toContain('t3')
      expect(result.map((t) => t.id)).not.toContain('t2')
    })

    it('returns empty when no tools have the selected integration', () => {
      expect(filterTools(TOOLS, '', [], ['Slack'])).toHaveLength(0)
    })
  })

  describe('combined filters', () => {
    it('applies query + phase + integration as AND logic across filter types', () => {
      // Anthropic tools, toteutus phase, GitHub integration → t1 and t2
      const result = filterTools(TOOLS, 'anthropic', ['toteutus'], ['GitHub'])
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('t1')
    })

    it('returns empty when combined filters produce no matches', () => {
      const result = filterTools(TOOLS, 'cursor', ['julkaisu'], [])
      expect(result).toHaveLength(0)
    })
  })
})
