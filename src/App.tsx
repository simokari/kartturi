import { useState } from 'react'
import type { Model, Tool, View } from './types'
import { ProcessMapView } from './components/ProcessMapView'
import { BrowseView } from './components/BrowseView'
import { CompareView } from './components/CompareView'
import { DetailPanel } from './components/DetailPanel'
import { useFavorites } from './hooks/useFavorites'

export default function App() {
  const [view, setView] = useState<View>('map')
  const [selectedEntry, setSelectedEntry] = useState<Model | Tool | null>(null)
  const { isFavorite, toggle: toggleFavorite } = useFavorites()

  return (
    <div className="app">
      <header className="header">
        <span className="logo">Kartturi</span>
        <nav className="nav" aria-label="Päänavigaatio">
          <button
            className={view === 'map' ? 'active' : ''}
            onClick={() => setView('map')}
            aria-current={view === 'map' ? 'page' : undefined}
          >
            Prosessikartta
          </button>
          <button
            className={view === 'browse' ? 'active' : ''}
            onClick={() => setView('browse')}
            aria-current={view === 'browse' ? 'page' : undefined}
          >
            Selaa
          </button>
          <button
            className={view === 'compare' ? 'active' : ''}
            onClick={() => setView('compare')}
            aria-current={view === 'compare' ? 'page' : undefined}
          >
            Vertaile
          </button>
        </nav>
      </header>
      <main className="main">
        {view === 'map' && (
          <ProcessMapView onSelect={setSelectedEntry} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
        )}
        {view === 'browse' && (
          <BrowseView onSelect={setSelectedEntry} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
        )}
        {view === 'compare' && <CompareView />}
      </main>
      {selectedEntry && (
        <DetailPanel
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          isFavorite={isFavorite(selectedEntry.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  )
}
