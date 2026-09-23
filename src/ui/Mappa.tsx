import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import type { LatLngBoundsExpression } from 'leaflet'
import { Pencil } from 'lucide-react'
import type { Coordinate } from '../dominio/coordinate'
import { distanzaDaCasa, formattaDistanza } from '../dominio/distanza'
import { formattaDurata } from '../dominio/durata'
import type { Trekking } from '../dominio/tipi'
import { formattaViaggio } from '../dominio/viaggio'
import 'leaflet/dist/leaflet.css'

interface Props {
  /** Gli stessi trekking dell'elenco: quelli senza coordinate non compaiono. */
  trekking: readonly Trekking[]
  casa: Coordinate | null
  onModifica: (trekking: Trekking) => void
}

/** Le Alpi orobiche, quando non c'è nessun puntino da mostrare. */
const CENTRO: [number, number] = [45.98, 9.87]
const ZOOM = 9

/**
 * La mappa (docs/02-funzionalita.md): un puntino per ogni trekking con le
 * coordinate, con il popup dei dettagli e il pulsante per modificare. Chi non ha
 * il luogo resta nell'elenco ma non compare qui.
 */
export function Mappa({ trekking, casa, onModifica }: Props) {
  const conLuogo = trekking.filter((t) => t.lat !== null && t.lon !== null)

  return (
    <div className="h-[calc(100dvh-140px)] min-h-[320px] overflow-hidden rounded-[11px] border border-bordo">
      <MapContainer center={CENTRO} zoom={ZOOM} scrollWheelZoom className="size-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <Inquadra trekking={conLuogo} />
        {conLuogo.map((t) => (
          <CircleMarker
            key={t.id}
            center={[t.lat as number, t.lon as number]}
            radius={8}
            pathOptions={{
              color: '#32516c',
              weight: 2,
              fillColor: t.completato ? '#dbe7f1' : '#5b87ad',
              fillOpacity: 1,
            }}
          >
            <Popup>
              <Dettagli trekking={t} casa={casa} onModifica={onModifica} />
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      {conLuogo.length === 0 && (
        <p className="sr-only" role="status">
          Nessun trekking con le coordinate.
        </p>
      )}
    </div>
  )
}

/** Sposta la mappa per far entrare tutti i puntini, quando cambiano. */
function Inquadra({ trekking }: { trekking: readonly Trekking[] }) {
  const mappa = useMap()

  useEffect(() => {
    if (trekking.length === 0) return
    const punti = trekking.map((t) => [t.lat as number, t.lon as number]) as LatLngBoundsExpression
    mappa.fitBounds(punti, { padding: [32, 32], maxZoom: 13 })
  }, [mappa, trekking])

  return null
}

/** Il popup: nome, numeri e link, con il pulsante per modificare. */
function Dettagli({ trekking: t, casa, onModifica }: { trekking: Trekking; casa: Coordinate | null; onModifica: (t: Trekking) => void }) {
  const righe = [
    ['Dislivello', t.dislivello === null ? '—' : `${t.dislivello} m`],
    ['Durata', formattaDurata(t.durata_ore)],
    ['Viaggio', formattaViaggio(t.viaggio_minuti)],
    ...(casa === null ? [] : [['Da casa', formattaDistanza(distanzaDaCasa(t, casa))]]),
  ]

  return (
    <div className="min-w-[180px] font-sans text-testo">
      <strong className="text-sm">{t.nome}</strong>
      {t.luogo_nome && <div className="text-xs text-testo-tenue">{t.luogo_nome}</div>}
      <dl className="my-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
        {righe.map(([etichetta, valore]) => (
          <Fragmento key={etichetta} etichetta={etichetta} valore={valore} />
        ))}
      </dl>
      <button
        type="button"
        className="flex min-h-9 items-center gap-1.5 rounded-[9px] px-2 font-semibold text-montagna-scura hover:bg-fondo"
        onClick={() => onModifica(t)}
      >
        <Pencil className="size-[15px]" aria-hidden="true" />
        Modifica
      </button>
    </div>
  )
}

function Fragmento({ etichetta, valore }: { etichetta: string; valore: string }) {
  return (
    <>
      <dt className="m-0 text-testo-tenue">{etichetta}</dt>
      <dd className="m-0">{valore}</dd>
    </>
  )
}
