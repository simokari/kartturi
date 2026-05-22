import { useMemo } from 'react'
import type { Model, Phase, Tool } from '../types'
import phasesRaw from '../data/phases.json'
import modelsRaw from '../data/models.json'
import toolsRaw from '../data/tools.json'
import { PhaseColumn } from './PhaseColumn'
import { daysSinceLastUpdate } from '../utils/staleness'

const phases = phasesRaw as Phase[]
const models = modelsRaw as Model[]
const tools = toolsRaw as Tool[]

const STALE_DAYS = 14

interface Props {
  onSelect: (entry: Model | Tool) => void
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
}

export function ProcessMapView({ onSelect, isFavorite, onToggleFavorite }: Props) {
  const staleDays = useMemo(() => daysSinceLastUpdate([...models, ...tools]), [])
  const isStale = staleDays > STALE_DAYS

  return (
    <section aria-label="AI-kehitysprosessin kartta">
      {isStale && (
        <div className="staleness-warning" role="alert">
          Data on <strong>{staleDays} päivää</strong> vanha — tiedot saattavat olla vanhentuneita.
        </div>
      )}
      <div className="phase-columns">
        {phases.map((phase) => (
          <PhaseColumn
            key={phase.id}
            phase={phase}
            models={models.filter((m) => m.phases.includes(phase.id))}
            tools={tools.filter((t) => t.phases.includes(phase.id))}
            onSelect={onSelect}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </section>
  )
}
