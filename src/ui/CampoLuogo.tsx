import { MapPin } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { luoghi } from '../dati'
import { coordinateValide } from '../dominio/coordinate'
import type { Luogo } from '../dominio/luoghi'
import { linkGoogle } from '../dominio/mappeGoogle'
import { statoDaLink, type StatoLuogo } from './luogo'

interface Props {
  valore: StatoLuogo
  onCambia: (valore: StatoLuogo) => void
}

/** Quanto si aspetta prima di chiedere i suggerimenti, mentre si scrive. */
const ATTESA = 350

/**
 * Il campo del luogo (docs/02-funzionalita.md): l'interruttore Nome /
 * Coordinate, i suggerimenti di Photon mentre si scrive il nome e le coordinate
 * incollate da Google Maps. Se si salva senza scegliere un suggerimento vale il
 * primo risultato (`risolviLuogo`). Un link di Google Maps incollato in uno dei
 * due campi si legge subito e lo sostituisce con il luogo trovato.
 */
export function CampoLuogo({ valore, onCambia }: Props) {
  const id = useId()
  const [suggerimenti, setSuggerimenti] = useState<Luogo[]>([])
  const [inCorso, setInCorso] = useState(false)
  const scritto = valore.nome.trim()
  const gia = valore.scelto?.nome === scritto
  const incollato = (valore.modo === 'nome' ? valore.nome : valore.coordinate).trim()
  const link = linkGoogle(incollato)
  const [erroreLink, setErroreLink] = useState<string | null>(null)

  useEffect(() => {
    setErroreLink(null)
    if (!link) return
    let annullato = false
    statoDaLink(incollato)
      .then((stato) => {
        if (!annullato) onCambia(stato)
      })
      .catch((errore: Error) => {
        console.error('Link di Google Maps non letto', errore)
        if (!annullato) setErroreLink('Link non letto: incolla le coordinate o scrivi il nome.')
      })
    return () => {
      annullato = true
    }
  }, [link, incollato, onCambia])

  useEffect(() => {
    if (valore.modo !== 'nome' || scritto === '' || gia || link) {
      setSuggerimenti([])
      setInCorso(false)
      return
    }
    const controllo = new AbortController()
    setInCorso(true)
    const attesa = setTimeout(() => {
      luoghi()
        .cerca(scritto, controllo.signal)
        .then((trovati) => {
          setSuggerimenti(trovati)
          setInCorso(false)
        })
        .catch(() => {
          if (!controllo.signal.aborted) {
            setSuggerimenti([])
            setInCorso(false)
          }
        })
    }, ATTESA)
    return () => {
      clearTimeout(attesa)
      controllo.abort()
    }
  }, [valore.modo, scritto, gia, link])

  return (
    <>
      <span className="text-sm font-semibold">Luogo</span>
      <div className="flex w-fit gap-0.5 rounded-[11px] bg-fondo p-0.5" role="group" aria-label="Come si indica il luogo">
        {(['nome', 'coordinate'] as const).map((modo) => (
          <button
            key={modo}
            type="button"
            className={`min-h-9 rounded-[9px] px-3 font-semibold ${
              valore.modo === modo ? 'bg-white text-montagna-scura' : 'text-testo-tenue'
            }`}
            aria-pressed={valore.modo === modo}
            onClick={() => onCambia({ ...valore, modo })}
          >
            {modo === 'nome' ? 'Nome' : 'Coordinate'}
          </button>
        ))}
      </div>
      {valore.modo === 'nome' ? (
        <>
          <label className="sr-only" htmlFor={`${id}-nome`}>
            Nome del luogo
          </label>
          <input
            id={`${id}-nome`}
            className="min-h-11 w-full rounded-[11px] border border-bordo bg-white px-3 focus:outline-2 focus:-outline-offset-1 focus:outline-montagna"
            placeholder="Rifugio Curò"
            autoComplete="off"
            value={valore.nome}
            onChange={(evento) => onCambia({ ...valore, nome: evento.target.value, scelto: null })}
          />
          {suggerimenti.length > 0 && (
            <ul className="m-0 animate-entra list-none rounded-[11px] border border-bordo bg-white p-1">
              {suggerimenti.map((luogo) => (
                <li key={`${luogo.lat},${luogo.lon},${luogo.nome}`}>
                  <button
                    type="button"
                    className="flex min-h-11 w-full items-center gap-2 rounded-[9px] px-2 text-left hover:bg-fondo"
                    onClick={() => onCambia({ ...valore, nome: luogo.nome, scelto: luogo })}
                  >
                    <MapPin className="size-[15px] shrink-0 text-testo-tenue" aria-hidden="true" />
                    {luogo.nome}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {link ? (
            <AvvisoLink errore={erroreLink} />
          ) : (
            <p className="m-0 text-xs text-testo-tenue">
              {gia && valore.scelto ? (
                <>
                  Luogo trovato: si salvano nome e coordinate{' '}
                  <strong className="font-semibold text-testo">
                    {valore.scelto.lat.toFixed(5)}, {valore.scelto.lon.toFixed(5)}
                  </strong>
                  .
                </>
              ) : inCorso
                  ? 'Cerco i luoghi…'
                  : 'Senza scegliere un suggerimento vale il primo risultato.'}
            </p>
          )}
        </>
      ) : (
        <>
          <label className="sr-only" htmlFor={`${id}-coordinate`}>
            Coordinate del luogo
          </label>
          <input
            id={`${id}-coordinate`}
            className="min-h-11 w-full rounded-[11px] border border-bordo bg-white px-3 focus:outline-2 focus:-outline-offset-1 focus:outline-montagna"
            placeholder="45.9876, 9.8765 o link di Maps"
            value={valore.coordinate}
            onChange={(evento) => onCambia({ ...valore, coordinate: evento.target.value })}
          />
          {link ? (
            <AvvisoLink errore={erroreLink} />
          ) : coordinateValide(valore.coordinate) ? (
            <p className="m-0 text-xs text-testo-tenue">
              Si incollano come si copiano da Google Maps, oppure il link di "Condividi".
            </p>
          ) : (
            <p className="m-0 text-xs text-pericolo">Servono due numeri: latitudine e longitudine.</p>
          )}
        </>
      )}
    </>
  )
}

/** Sotto il campo mentre si legge un link di Google Maps, o quando non si è letto. */
function AvvisoLink({ errore }: { errore: string | null }) {
  return errore ? (
    <p className="m-0 text-xs text-pericolo" role="alert">
      {errore}
    </p>
  ) : (
    <p className="m-0 text-xs text-testo-tenue" role="status">
      Leggo il link di Google Maps…
    </p>
  )
}
