# Kartturi

AI-kentän seurantasovellus. Kartta koko AI-avusteisesta kehitysprosessista:
suunnittelu → toteutus → review → testaus → julkaisu → seuranta.

## Stack

- React 19 + Vite + TypeScript (strict mode)
- `src/App.tsx` — pääkomponentti (näkymien reititys)
- `src/types/index.ts` — kaikki tyypit
- `src/data/` — JSON-datat (agentin päivittämä)
- localStorage — suosikit ja UI-asetukset
- GitHub `simokari/kartturi` → Vercel auto-deploy

## Hakemistorakenne

```
src/
  App.tsx          # pääkomponentti
  main.tsx
  index.css
  types/index.ts   # Model, Tool, Phase, PhaseId, Pricing...
  data/
    phases.json    # kehitysprosessin vaiheet (kiinteä)
    models.json    # kielimallit
    tools.json     # avustavat työkalut
```

## Näkymät

1. **Prosessikartta** (`view === 'map'`) — oletusnäkymä, putki vaihe→kortit
2. **Selausnäkymä** (`view === 'browse'`) — välilehdet + suodatus + haku
3. **Vertailunäkymä** (`view === 'compare'`) — 2–3 kohteen rinnakkaintaulukko

## Datan päivitys (ajastettu agentti)

Viikoittainen Claude-agentti päivittää `src/data/*.json`:
1. Hakee tuoreet tiedot webistä (hinnat, versiot, uudet työkalut)
2. Päivittää `lastUpdated` ja `confidence` kentät
3. Committaa: `chore: update AI landscape data YYYY-MM-DD`
4. Push → Vercel deployaa automaattisesti

JSON-skeema validoidaan build-vaiheessa — rikkinäinen JSON estää deployn.

## Deploy-workflow

```
git add src/data/
git commit -m "chore: update AI landscape data $(date +%Y-%m-%d)"
git push  # → Vercel deployaa automaattisesti
```

## Tärkeää

- `npm run dev` — kehityspalvelin (aja omassa PowerShellissä)
- `npm run build` — tarkistaa TypeScript + buildaa
- Varoitusbanneri UI:ssa jos data > 14 vrk vanha
- Mobiilissa prosessikartta on vertikaalisessa pinossa
