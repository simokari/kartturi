import { useEffect, useRef } from 'react'
import type { Model, Tool } from '../types'
import { isTool } from '../utils/entryGuards'

interface Props {
  entry: Model | Tool
  onClose: () => void
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

export function DetailPanel({ entry, onClose, isFavorite, onToggleFavorite }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => { prev?.focus() }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const tool = isTool(entry) ? entry : null
  const model = isTool(entry) ? null : entry
  const tag = tool ? tool.type : model!.category

  return (
    <>
      <div className="detail-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className="detail-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`${entry.name} — tiedot`}
      >
        <header className="detail-header">
          <div>
            <h2 className="detail-name">{entry.name}</h2>
            <span className="detail-vendor">{entry.vendor}</span>
          </div>
          <div className="detail-header-actions">
            <button
              type="button"
              className={`detail-star${isFavorite ? ' active' : ''}`}
              aria-label={isFavorite ? `Poista ${entry.name} suosikeista` : `Lisää ${entry.name} suosikkeihin`}
              aria-pressed={isFavorite}
              onClick={() => onToggleFavorite(entry.id)}
            >
              {isFavorite ? '★' : '☆'}
            </button>
            <button ref={closeRef} className="detail-close" onClick={onClose} aria-label="Sulje paneeli">
              ×
            </button>
          </div>
        </header>

        <div className="detail-body">
          <div className="detail-meta">
            <span className="entry-tag">{tag}</span>
            <span
              className={`confidence-dot ${entry.confidence}`}
              title={entry.confidence === 'verified' ? 'Varmennettu' : 'Arvioitu'}
            />
            <span className="detail-confidence-label">
              {entry.confidence === 'verified' ? 'Varmennettu' : 'Arvioitu'}
            </span>
          </div>

          {tool && <p className="detail-purpose">{tool.purpose}</p>}

          {model && (
            <dl className="detail-dl">
              <dt>Versio</dt>
              <dd>{model.latestVersion}</dd>
              <dt>Julkaistu</dt>
              <dd>{model.releaseDate}</dd>
              <dt>Konteksti-ikkuna</dt>
              <dd>{model.contextWindow}</dd>
            </dl>
          )}

          <section>
            <h3 className="detail-section-title">Kehitysvaiheet</h3>
            <div className="detail-chips">
              {entry.phases.map((p) => (
                <span key={p} className="detail-chip">{p}</span>
              ))}
            </div>
          </section>

          {tool && tool.integrations.length > 0 && (
            <section>
              <h3 className="detail-section-title">Integraatiot</h3>
              <div className="detail-chips">
                {tool.integrations.map((i) => (
                  <span key={i} className="detail-chip">{i}</span>
                ))}
              </div>
            </section>
          )}

          {tool && tool.worksWith.length > 0 && (
            <section>
              <h3 className="detail-section-title">Toimii yhdessä</h3>
              <div className="detail-chips">
                {tool.worksWith.map((w) => (
                  <span key={w} className="detail-chip">{w}</span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="detail-section-title">Vahvuudet</h3>
            <ul className="detail-list">
              {entry.strengths.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </section>

          <section>
            <h3 className="detail-section-title">Rajoitukset</h3>
            <ul className="detail-list">
              {entry.limitations.map((l) => <li key={l}>{l}</li>)}
            </ul>
          </section>

          <section>
            <h3 className="detail-section-title">Sopii parhaiten</h3>
            <ul className="detail-list">
              {entry.bestFor.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </section>

          <section>
            <h3 className="detail-section-title">Hinnoittelu</h3>
            <div className="detail-pricing">
              {entry.pricing.subscription.map((t) => (
                <div key={t.tier} className="detail-price-row">
                  <span>{t.tier}</span>
                  <span className="detail-price-value">{t.price}</span>
                </div>
              ))}
              {entry.pricing.api && (
                <p className="detail-price-api">
                  API: {entry.pricing.api.input} sisään / {entry.pricing.api.output} ulos
                </p>
              )}
              {entry.pricing.notes && (
                <p className="detail-price-notes">{entry.pricing.notes}</p>
              )}
            </div>
          </section>

          <section>
            <h3 className="detail-section-title">Linkit</h3>
            <div className="detail-links">
              <a href={entry.links.docs} target="_blank" rel="noopener noreferrer">Dokumentaatio</a>
              {entry.links.pricing && (
                <a href={entry.links.pricing} target="_blank" rel="noopener noreferrer">Hinnoittelu</a>
              )}
              {entry.links.home && (
                <a href={entry.links.home} target="_blank" rel="noopener noreferrer">Kotisivu</a>
              )}
            </div>
          </section>

          <footer className="detail-footer">
            <span>Päivitetty {entry.lastUpdated}</span>
            <a href={entry.source} target="_blank" rel="noopener noreferrer">Lähde</a>
          </footer>
        </div>
      </div>
    </>
  )
}
