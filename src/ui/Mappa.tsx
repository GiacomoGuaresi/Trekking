import { CircleMarker, LayersControl, MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import { useEffect, useMemo } from 'react'
import { divIcon, type LatLngBoundsExpression } from 'leaflet'
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

/** L'icona di casa: una casetta disegnata a mano, senza file da caricare. */
const ICONA_CASA = divIcon({
  className: '',
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  html: `<span style="display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#fbf8f1;border:2px solid #32516c;box-shadow:0 1px 4px rgb(37 50 62 / 0.3)">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#32516c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>
  </span>`,
})

/** Le Alpi orobiche, quando non c'è nessun puntino da mostrare. */
const CENTRO: [number, number] = [45.98, 9.87]
const ZOOM = 9

/** Quanto spazio lascia in alto la barra flottante di ricerca e filtri. */
const SOTTO_LA_BARRA = 80

/**
 * La mappa (docs/02-funzionalita.md): un puntino per ogni trekking con le
 * coordinate, con il popup dei dettagli e il pulsante per modificare. Chi non ha
 * il luogo resta nell'elenco ma non compare qui. Casa ha la sua icona, e si può
 * passare a OpenTopoMap per vedere curve di livello e sentieri.
 *
 * Riempie tutto il contenitore: sopra, in alto, galleggia la barra con ricerca
 * e filtri, quindi i comandi di Leaflet stanno in basso a destra e inquadratura
 * e popup lasciano libera la fascia in alto.
 */
export function Mappa({ trekking, casa, onModifica }: Props) {
  const conLuogo = trekking.filter((t) => t.lat !== null && t.lon !== null)

  return (
    <div className="size-full">
      <MapContainer center={CENTRO} zoom={ZOOM} scrollWheelZoom zoomControl={false} className="size-full">
        <ZoomControl position="bottomright" />
        <LayersControl position="bottomright">
          <LayersControl.BaseLayer checked name="Mappa">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Sentieri">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, tessere di <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              maxZoom={17}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <Inquadra trekking={conLuogo} casa={casa} />
        {casa !== null && (
          <Marker position={[casa.lat, casa.lon]} icon={ICONA_CASA} title="Casa" alt="Casa" />
        )}
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
            <Popup autoPanPaddingTopLeft={[16, SOTTO_LA_BARRA]}>
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

/** Sposta la mappa per far entrare tutti i puntini e casa, quando cambiano. */
function Inquadra({ trekking, casa }: { trekking: readonly Trekking[]; casa: Coordinate | null }) {
  const mappa = useMap()
  const punti = useMemo(
    () => [
      ...trekking.map((t) => [t.lat as number, t.lon as number] as [number, number]),
      ...(casa === null ? [] : [[casa.lat, casa.lon] as [number, number]]),
    ],
    [trekking, casa],
  )

  useEffect(() => {
    if (punti.length === 0) return
    mappa.fitBounds(punti as LatLngBoundsExpression, {
      paddingTopLeft: [32, SOTTO_LA_BARRA],
      paddingBottomRight: [32, 32],
      maxZoom: 13,
    })
  }, [mappa, punti])

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
