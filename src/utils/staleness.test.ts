import { describe, it, expect } from 'vitest'
import type { Model, Tool } from '../types'
import { daysSinceLastUpdate } from './staleness'

const DAY_MS = 86_400_000

function makeModel(lastUpdated: string): Model {
  return {
    id: 'x', name: 'X', vendor: 'V', latestVersion: '1', releaseDate: '2025-01',
    category: 'yleismalli', phases: ['toteutus'], strengths: [], limitations: [],
    contextWindow: '1k', pricing: { subscription: [] }, bestFor: [],
    links: { docs: 'https://example.com' },
    lastUpdated, source: 'https://example.com', confidence: 'verified',
  }
}

function makeTool(lastUpdated: string): Tool {
  return {
    id: 'x', name: 'X', vendor: 'V', type: 'CLI', purpose: 'test',
    phases: ['toteutus'], integrations: [], worksWith: [], strengths: [], limitations: [],
    pricing: { subscription: [] }, bestFor: [],
    links: { docs: 'https://example.com' },
    lastUpdated, source: 'https://example.com', confidence: 'verified',
  }
}

describe('daysSinceLastUpdate', () => {
  it('returns 0 when the only entry was updated on the reference day', () => {
    const now = new Date('2025-06-15').getTime()
    expect(daysSinceLastUpdate([makeModel('2025-06-15')], now)).toBe(0)
  })

  it('returns correct day count for a single entry', () => {
    const now = new Date('2025-06-15').getTime()
    expect(daysSinceLastUpdate([makeModel('2025-06-08')], now)).toBe(7)
  })

  it('uses the most recent entry when multiple present', () => {
    const now = new Date('2025-06-15').getTime()
    const entries = [makeModel('2025-06-01'), makeModel('2025-06-10'), makeModel('2025-06-05')]
    expect(daysSinceLastUpdate(entries, now)).toBe(5)
  })

  it('works with Tool entries as well as Model entries', () => {
    const now = new Date('2025-06-15').getTime()
    expect(daysSinceLastUpdate([makeTool('2025-06-13')], now)).toBe(2)
  })

  it('handles mixed Model and Tool arrays and picks the latest', () => {
    const now = new Date('2025-06-15').getTime()
    const entries = [makeModel('2025-06-01'), makeTool('2025-06-12')]
    expect(daysSinceLastUpdate(entries, now)).toBe(3)
  })

  it('uses Date.now() when no reference time is given', () => {
    const recentDate = new Date(Date.now() - 3 * DAY_MS).toISOString().slice(0, 10)
    const result = daysSinceLastUpdate([makeModel(recentDate)])
    expect(result).toBeGreaterThanOrEqual(3)
    expect(result).toBeLessThanOrEqual(4)
  })
})
