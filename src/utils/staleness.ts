import type { Model, Tool } from '../types'

export function daysSinceLastUpdate(entries: (Model | Tool)[], now = Date.now()): number {
  const latest = entries.reduce((max, e) => {
    const d = new Date(e.lastUpdated).getTime()
    return d > max ? d : max
  }, 0)
  return Math.floor((now - latest) / 86_400_000)
}
