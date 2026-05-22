import type { Model, PhaseId, Tool } from '../types'

export function filterModels(
  models: Model[],
  query: string,
  selectedPhases: PhaseId[],
): Model[] {
  const q = query.toLowerCase()
  return models.filter((m) => {
    const matchesQuery = !q || m.name.toLowerCase().includes(q) || m.vendor.toLowerCase().includes(q)
    const matchesPhases = selectedPhases.length === 0 || selectedPhases.some((p) => m.phases.includes(p))
    return matchesQuery && matchesPhases
  })
}

export function filterTools(
  tools: Tool[],
  query: string,
  selectedPhases: PhaseId[],
  selectedIntegrations: string[],
): Tool[] {
  const q = query.toLowerCase()
  return tools.filter((t) => {
    const matchesQuery = !q || t.name.toLowerCase().includes(q) || t.vendor.toLowerCase().includes(q)
    const matchesPhases = selectedPhases.length === 0 || selectedPhases.some((p) => t.phases.includes(p))
    const matchesInteg = selectedIntegrations.length === 0 || selectedIntegrations.some((i) => t.integrations.includes(i))
    return matchesQuery && matchesPhases && matchesInteg
  })
}
