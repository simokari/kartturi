import type { Model, Tool } from '../types'
import { isTool } from '../utils/entryGuards'

type Props =
  | { kind: 'model'; entry: Model; onSelect: (entry: Model | Tool) => void; isFavorite: boolean; onToggleFavorite: (id: string) => void }
  | { kind: 'tool'; entry: Tool; onSelect: (entry: Model | Tool) => void; isFavorite: boolean; onToggleFavorite: (id: string) => void }

export function EntryCard({ kind, entry, onSelect, isFavorite, onToggleFavorite }: Props) {
  const tag = isTool(entry) ? entry.type : entry.category
  const label = `${entry.name}, ${entry.vendor}, ${tag}`

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(entry)
    }
  }

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite(entry.id)
  }

  return (
    <div
      className="entry-card"
      tabIndex={0}
      role="button"
      aria-label={label}
      onClick={() => onSelect(entry)}
      onKeyDown={handleKeyDown}
    >
      <div className="entry-card-top">
        <span className="entry-name">{entry.name}</span>
        <div className="entry-card-right">
          <button
            type="button"
            className={`entry-star${isFavorite ? ' active' : ''}`}
            aria-label={isFavorite ? `Poista ${entry.name} suosikeista` : `Lisää ${entry.name} suosikkeihin`}
            aria-pressed={isFavorite}
            onClick={handleStarClick}
          >
            {isFavorite ? '★' : '☆'}
          </button>
          <span
            className={`confidence-dot ${entry.confidence}`}
            aria-hidden="true"
            title={entry.confidence === 'verified' ? 'Varmennettu' : 'Arvioitu'}
          />
        </div>
      </div>
      <span className="entry-vendor">{entry.vendor}</span>
      <span className="entry-tag">{tag}</span>
    </div>
  )
}
