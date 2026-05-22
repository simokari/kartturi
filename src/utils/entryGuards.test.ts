import { describe, it, expect } from 'vitest'
import type { Model, Tool } from '../types'
import { isTool } from './entryGuards'

const model: Model = {
  id: 'm', name: 'Model', vendor: 'V', latestVersion: '1', releaseDate: '2025-01',
  category: 'yleismalli', phases: ['toteutus'], strengths: [], limitations: [],
  contextWindow: '1k', pricing: { subscription: [] }, bestFor: [],
  links: { docs: 'https://example.com' },
  lastUpdated: '2025-01-01', source: 'https://example.com', confidence: 'verified',
}

const tool: Tool = {
  id: 't', name: 'Tool', vendor: 'V', type: 'CLI', purpose: 'does things',
  phases: ['toteutus'], integrations: ['GitHub'], worksWith: [], strengths: [], limitations: [],
  pricing: { subscription: [] }, bestFor: [],
  links: { docs: 'https://example.com' },
  lastUpdated: '2025-01-01', source: 'https://example.com', confidence: 'verified',
}

describe('isTool', () => {
  it('returns true for a Tool (has purpose field)', () => {
    expect(isTool(tool)).toBe(true)
  })

  it('returns false for a Model (no purpose field)', () => {
    expect(isTool(model)).toBe(false)
  })

  it('narrows the type so TypeScript accepts tool-only fields', () => {
    const entry: Model | Tool = tool
    if (isTool(entry)) {
      // If type narrowing works, this compiles without error
      expect(entry.purpose).toBe('does things')
      expect(entry.integrations).toEqual(['GitHub'])
    }
  })

  it('narrowed false branch gives access to model-only fields', () => {
    const entry: Model | Tool = model
    if (!isTool(entry)) {
      expect(entry.category).toBe('yleismalli')
      expect(entry.contextWindow).toBe('1k')
    }
  })
})
