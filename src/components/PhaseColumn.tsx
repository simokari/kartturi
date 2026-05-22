import type { Model, Phase, Tool } from '../types'
import { EntryCard } from './EntryCard'

interface Props {
  phase: Phase
  models: Model[]
  tools: Tool[]
  onSelect: (entry: Model | Tool) => void
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
}

export function PhaseColumn({ phase, models, tools, onSelect, isFavorite, onToggleFavorite }: Props) {
  const total = models.length + tools.length

  return (
    <div className="phase-column">
      <header className="phase-header">
        <div className="phase-header-top">
          <h2 className="phase-name">{phase.name}</h2>
          {total > 0 && <span className="phase-count">{total}</span>}
        </div>
        <p className="phase-desc">{phase.description}</p>
      </header>
      <ul className="phase-entries" aria-label={`${phase.name} -vaiheen merkinnät`}>
        {models.map((m) => (
          <li key={m.id}>
            <EntryCard entry={m} onSelect={onSelect} isFavorite={isFavorite(m.id)} onToggleFavorite={onToggleFavorite} />
          </li>
        ))}
        {tools.map((t) => (
          <li key={t.id}>
            <EntryCard entry={t} onSelect={onSelect} isFavorite={isFavorite(t.id)} onToggleFavorite={onToggleFavorite} />
          </li>
        ))}
        {total === 0 && (
          <li className="phase-empty" aria-label="Ei merkintöjä tässä vaiheessa">
            —
          </li>
        )}
      </ul>
    </div>
  )
}
