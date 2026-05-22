import { useState } from 'react'
import type { Model, PhaseId, Tool } from '../types'
import modelsRaw from '../data/models.json'
import toolsRaw from '../data/tools.json'
import { isTool } from '../utils/entryGuards'

const models = modelsRaw as Model[]
const tools = toolsRaw as Tool[]
const ALL_ENTRIES: (Model | Tool)[] = [...models, ...tools]

const PHASES: PhaseId[] = ['suunnittelu', 'toteutus', 'review', 'testaus', 'julkaisu', 'seuranta']

// ── EntryPicker ───────────────────────────────────────────────────────────────

interface PickerProps {
  onSelect: (entry: Model | Tool) => void
  excluded: string[]
}

function EntryPicker({ onSelect, excluded }: PickerProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const results = query.length >= 1
    ? ALL_ENTRIES
        .filter((e) => !excluded.includes(e.id))
        .filter((e) =>
          e.name.toLowerCase().includes(query.toLowerCase()) ||
          e.vendor.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 8)
    : []

  const handleSelect = (entry: Model | Tool) => {
    onSelect(entry)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="picker-wrap">
      <input
        type="search"
        className="picker-input"
        placeholder="Hae mallia tai työkalua…"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        aria-label="Hae vertailtava kohde"
        aria-autocomplete="list"
        aria-expanded={open && results.length > 0}
      />
      {open && query.length >= 1 && (
        results.length > 0 ? (
          <ul className="picker-results" role="listbox">
            {results.map((e) => (
              <li key={e.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  className="picker-option"
                  onMouseDown={(ev) => { ev.preventDefault(); handleSelect(e) }}
                >
                  <span className="picker-option-name">{e.name}</span>
                  <span className="picker-option-meta">
                    {e.vendor} · {isTool(e) ? e.type : e.category}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="picker-empty">Ei tuloksia</div>
        )
      )}
    </div>
  )
}

// ── CompareSlot ───────────────────────────────────────────────────────────────

interface SlotProps {
  entry: Model | Tool | null
  excluded: string[]
  onSelect: (entry: Model | Tool) => void
  onRemove: () => void
}

function CompareSlot({ entry, excluded, onSelect, onRemove }: SlotProps) {
  if (entry) {
    return (
      <div className="compare-slot compare-slot--filled">
        <div className="compare-slot-info">
          <span className="compare-slot-name">{entry.name}</span>
          <span className="compare-slot-vendor">{entry.vendor}</span>
        </div>
        <button
          type="button"
          className="compare-slot-remove"
          onClick={onRemove}
          aria-label={`Poista ${entry.name} vertailusta`}
        >
          ×
        </button>
      </div>
    )
  }
  return (
    <div className="compare-slot compare-slot--empty">
      <EntryPicker onSelect={onSelect} excluded={excluded} />
    </div>
  )
}

// ── CompareTable ──────────────────────────────────────────────────────────────

function renderList(items: string[]) {
  if (items.length === 0) return <span className="compare-na">—</span>
  return (
    <ul className="compare-list">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  )
}

function PhaseRow({ entry }: { entry: Model | Tool }) {
  return (
    <div className="compare-phases">
      {PHASES.map((p) => (
        <span
          key={p}
          className={`compare-phase ${entry.phases.includes(p) ? 'compare-phase--on' : ''}`}
          title={p}
          aria-label={`${p}: ${entry.phases.includes(p) ? 'kyllä' : 'ei'}`}
        />
      ))}
    </div>
  )
}

function CompareTable({ entries }: { entries: (Model | Tool)[] }) {
  return (
    <div className="compare-table-wrap">
      <table className="compare-table">
        <thead>
          <tr>
            <th className="compare-label-col" />
            {entries.map((e) => (
              <th key={e.id} className="compare-entry-col" scope="col">
                <div className="compare-th-name">{e.name}</div>
                <div className="compare-th-vendor">{e.vendor}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Tyyppi</th>
            {entries.map((e) => <td key={e.id}>{isTool(e) ? e.type : e.category}</td>)}
          </tr>

          <tr>
            <th scope="row">Vaiheet</th>
            {entries.map((e) => <td key={e.id}><PhaseRow entry={e} /></td>)}
          </tr>

          <tr>
            <th scope="row">Konteksti-ikkuna</th>
            {entries.map((e) => (
              <td key={e.id}>
                {isTool(e) ? <span className="compare-na">—</span> : e.contextWindow}
              </td>
            ))}
          </tr>

          <tr>
            <th scope="row">Tilaus</th>
            {entries.map((e) => (
              <td key={e.id}>
                {e.pricing.subscription.length > 0
                  ? e.pricing.subscription.map((t) => (
                      <div key={t.tier} className="compare-price-line">
                        <span className="compare-price-tier">{t.tier}</span>
                        <span className="compare-price-val">{t.price}</span>
                      </div>
                    ))
                  : <span className="compare-na">—</span>
                }
              </td>
            ))}
          </tr>

          <tr>
            <th scope="row">API-hinta</th>
            {entries.map((e) => (
              <td key={e.id}>
                {e.pricing.api
                  ? <><div>{e.pricing.api.input} sisään</div><div className="compare-na">{e.pricing.api.output} ulos</div></>
                  : <span className="compare-na">—</span>
                }
              </td>
            ))}
          </tr>

          <tr>
            <th scope="row">Vahvuudet</th>
            {entries.map((e) => <td key={e.id}>{renderList(e.strengths)}</td>)}
          </tr>

          <tr>
            <th scope="row">Rajoitukset</th>
            {entries.map((e) => <td key={e.id}>{renderList(e.limitations)}</td>)}
          </tr>

          <tr>
            <th scope="row">Sopii parhaiten</th>
            {entries.map((e) => <td key={e.id}>{renderList(e.bestFor)}</td>)}
          </tr>

          <tr>
            <th scope="row">Integraatiot</th>
            {entries.map((e) => (
              <td key={e.id}>
                {isTool(e) && e.integrations.length > 0
                  ? (
                    <div className="compare-chips">
                      {e.integrations.map((i) => (
                        <span key={i} className="detail-chip">{i}</span>
                      ))}
                    </div>
                  )
                  : <span className="compare-na">—</span>
                }
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ── CompareView ───────────────────────────────────────────────────────────────

export function CompareView() {
  const [slots, setSlots] = useState<(Model | Tool | null)[]>([null, null, null])

  const filled = slots.filter((s): s is Model | Tool => s !== null)
  const excludedIds = filled.map((e) => e.id)

  const setSlot = (i: number, entry: Model | Tool) =>
    setSlots((prev) => prev.map((s, idx) => (idx === i ? entry : s)))

  const removeSlot = (i: number) =>
    setSlots((prev) => prev.map((s, idx) => (idx === i ? null : s)))

  return (
    <section aria-label="Vertailunäkymä">
      <div className="compare-slots">
        {slots.map((slot, i) => (
          <CompareSlot
            key={i}
            entry={slot}
            excluded={excludedIds}
            onSelect={(e) => setSlot(i, e)}
            onRemove={() => removeSlot(i)}
          />
        ))}
      </div>

      {filled.length >= 2 ? (
        <CompareTable entries={filled} />
      ) : (
        <p className="compare-hint">
          {filled.length === 0
            ? 'Valitse 2–3 mallia tai työkalua hakemalla ne ylläoleviin kenttiin.'
            : 'Lisää toinen kohde vertailun aloittamiseksi.'}
        </p>
      )}
    </section>
  )
}
