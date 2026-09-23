import { MapPin } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { luoghi } from '../dati'
import { coordinateValide } from '../dominio/coordinate'
import type { Luogo } from '../dominio/luoghi'
import type { StatoLuogo } from './luogo'

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
 * primo risultato (`risolviLuogo`).
 */
export function CampoLuogo({ valore, onCambia }: Props) {
  const id = useId()
  const [suggerimenti, setSuggerimenti] = useState<Luogo[]>([])
  const [inCorso, setInCorso] = useState(false)
  const scritto = valore.nome.trim()
  const gia = valore.scelto?.nome === scritto

  useEffect(() => {
    if (valore.modo !== 'nome' || scritto === '' || gia) {
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
  }, [valore.modo, scritto, gia])

  return (
    <>
      <span className="mt-2 text-xs text-testo-tenue">Luogo</span>
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
          <p className="m-0 text-xs text-testo-tenue">
            {gia
              ? 'Luogo trovato: si salvano nome e coordinate.'
              : inCorso
                ? 'Cerco i luoghi…'
                : 'Senza scegliere un suggerimento vale il primo risultato.'}
          </p>
        </>
      ) : (
        <>
          <label className="sr-only" htmlFor={`${id}-coordinate`}>
            Coordinate del luogo
          </label>
          <input
            id={`${id}-coordinate`}
            className="min-h-11 w-full rounded-[11px] border border-bordo bg-white px-3 focus:outline-2 focus:-outline-offset-1 focus:outline-montagna"
            placeholder="45.9876, 9.8765"
            value={valore.coordinate}
            onChange={(evento) => onCambia({ ...valore, coordinate: evento.target.value })}
          />
          {coordinateValide(valore.coordinate) ? (
            <p className="m-0 text-xs text-testo-tenue">Si incollano come si copiano da Google Maps.</p>
          ) : (
            <p className="m-0 text-xs text-pericolo">Servono due numeri: latitudine e longitudine.</p>
          )}
        </>
      )}
    </>
  )
}
