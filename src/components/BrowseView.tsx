import { useState, useMemo, useCallback } from 'react'
import type { Model, Phase, PhaseId, Tool } from '../types'
import modelsRaw from '../data/models.json'
import toolsRaw from '../data/tools.json'
import phasesRaw from '../data/phases.json'
import { EntryCard } from './EntryCard'
import { filterModels, filterTools } from '../utils/filters'

const models = modelsRaw as Model[]
const tools = toolsRaw as Tool[]
const phases = phasesRaw as Phase[]

type Tab = 'models' | 'tools'

const ALL_INTEGRATIONS = [...new Set(tools.flatMap((t) => t.integrations))].sort()

// ── SearchBar ────────────────────────────────────────────────────────────────

interface SearchBarProps {
  value: string
  onChange: (v: string) => void
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-wrap">
      <input
        type="search"
        className="search-input"
        placeholder="Hae nimellä tai vendorilla…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Hae malleja ja työkaluja"
      />
      {value && (
        <button type="button" className="search-clear" onClick={() => onChange('')} aria-label="Tyhjennä haku">
          ×
        </button>
      )}
    </div>
  )
}

// ── FilterBar ────────────────────────────────────────────────────────────────

interface FilterBarProps {
  selectedPhases: PhaseId[]
  onTogglePhase: (id: PhaseId) => void
  integrations: string[]
  selectedIntegrations: string[]
  onToggleIntegration: (name: string) => void
}

function FilterBar({ selectedPhases, onTogglePhase, integrations, selectedIntegrations, onToggleIntegration }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-group" role="group" aria-label="Suodata kehitysvaiheen mukaan">
        <span className="filter-label">Vaihe</span>
        <div className="filter-chips">
          {phases.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`filter-chip${selectedPhases.includes(p.id) ? ' active' : ''}`}
              onClick={() => onTogglePhase(p.id)}
              aria-pressed={selectedPhases.includes(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
      {integrations.length > 0 && (
        <div className="filter-group" role="group" aria-label="Suodata integraation mukaan">
          <span className="filter-label">Integraatio</span>
          <div className="filter-chips">
            {integrations.map((i) => (
              <button
                key={i}
                type="button"
                className={`filter-chip${selectedIntegrations.includes(i) ? ' active' : ''}`}
                onClick={() => onToggleIntegration(i)}
                aria-pressed={selectedIntegrations.includes(i)}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── BrowseView ───────────────────────────────────────────────────────────────

interface Props {
  onSelect: (entry: Model | Tool) => void
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
}

export function BrowseView({ onSelect, isFavorite, onToggleFavorite }: Props) {
  const [tab, setTab] = useState<Tab>('models')
  const [query, setQuery] = useState('')
  const [selectedPhases, setSelectedPhases] = useState<PhaseId[]>([])
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const [onlyFavorites, setOnlyFavorites] = useState(false)

  const togglePhase = useCallback((id: PhaseId) => {
    setSelectedPhases((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id])
  }, [])

  const toggleIntegration = useCallback((name: string) => {
    setSelectedIntegrations((prev) => prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name])
  }, [])

  const switchTab = useCallback((next: Tab) => {
    setTab(next)
    setSelectedIntegrations([])
  }, [])

  const filteredModels = useMemo<Model[]>(() => {
    if (tab !== 'models') return []
    const base = filterModels(models, query, selectedPhases)
    return onlyFavorites ? base.filter((m) => isFavorite(m.id)) : base
  }, [tab, query, selectedPhases, onlyFavorites, isFavorite])

  const filteredTools = useMemo<Tool[]>(() => {
    if (tab !== 'tools') return []
    const base = filterTools(tools, query, selectedPhases, selectedIntegrations)
    return onlyFavorites ? base.filter((t) => isFavorite(t.id)) : base
  }, [tab, query, selectedPhases, selectedIntegrations, onlyFavorites, isFavorite])

  const entries = tab === 'models' ? filteredModels : filteredTools
  const totalCount = tab === 'models' ? models.length : tools.length
  const hasFilters = query !== '' || selectedPhases.length > 0 || selectedIntegrations.length > 0 || onlyFavorites

  const clearAll = useCallback(() => {
    setQuery('')
    setSelectedPhases([])
    setSelectedIntegrations([])
    setOnlyFavorites(false)
  }, [])

  return (
    <section aria-label="Selausnäkymä">
      <nav role="tablist" className="browse-tabs" aria-label="Mallit ja Työkalut">
        <button role="tab" type="button" aria-selected={tab === 'models'}
          className={`browse-tab${tab === 'models' ? ' active' : ''}`}
          onClick={() => switchTab('models')}>
          Mallit <span className="tab-count">{models.length}</span>
        </button>
        <button role="tab" type="button" aria-selected={tab === 'tools'}
          className={`browse-tab${tab === 'tools' ? ' active' : ''}`}
          onClick={() => switchTab('tools')}>
          Työkalut <span className="tab-count">{tools.length}</span>
        </button>
      </nav>

      <div className="browse-controls">
        <div className="browse-controls-top">
          <SearchBar value={query} onChange={setQuery} />
          <button
            type="button"
            className={`favorites-toggle${onlyFavorites ? ' active' : ''}`}
            aria-pressed={onlyFavorites}
            onClick={() => setOnlyFavorites((v) => !v)}
          >
            {onlyFavorites ? '★' : '☆'} Suosikit
          </button>
        </div>
        <FilterBar
          selectedPhases={selectedPhases}
          onTogglePhase={togglePhase}
          integrations={tab === 'tools' ? ALL_INTEGRATIONS : []}
          selectedIntegrations={selectedIntegrations}
          onToggleIntegration={toggleIntegration}
        />
      </div>

      <div className="results-header" aria-live="polite" aria-atomic="true">
        <span className="results-count">
          {entries.length === totalCount ? `${totalCount} kpl` : `${entries.length} / ${totalCount}`}
        </span>
        {hasFilters && (
          <button type="button" className="clear-all" onClick={clearAll}>
            Tyhjennä suodattimet
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="no-results" role="status">
          {onlyFavorites ? 'Ei suosikkeja tässä välilehdessä.' : 'Ei hakutuloksia'}
        </p>
      ) : (
        <ul className="entry-grid" aria-label={tab === 'models' ? 'Mallit' : 'Työkalut'}>
          {tab === 'models'
            ? filteredModels.map((m) => (
                <li key={m.id}>
                  <EntryCard kind="model" entry={m} onSelect={onSelect} isFavorite={isFavorite(m.id)} onToggleFavorite={onToggleFavorite} />
                </li>
              ))
            : filteredTools.map((t) => (
                <li key={t.id}>
                  <EntryCard kind="tool" entry={t} onSelect={onSelect} isFavorite={isFavorite(t.id)} onToggleFavorite={onToggleFavorite} />
                </li>
              ))
          }
        </ul>
      )}
    </section>
  )
}
