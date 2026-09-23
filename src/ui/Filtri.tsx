import { SlidersHorizontal } from 'lucide-react'
import { useId, useState } from 'react'
import { type Filtri as Valori, limite, quantiFiltri, testoLimite } from '../dominio/filtri'

interface Props {
  valori: Valori
  onCambia: (valori: Valori) => void
}

/**
 * I filtri dell'elenco (docs/02-funzionalita.md): un pulsante che dice quanti
 * limiti sono accesi e apre il pannello. Per ora c'è il solo dislivello; gli
 * altri si aggiungono qui con gli step della roadmap.
 */
export function Filtri({ valori, onCambia }: Props) {
  const [aperto, setAperto] = useState(false)
  const id = useId()
  const quanti = quantiFiltri(valori)

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex min-h-11 items-center gap-1.5 rounded-[11px] px-2.5 font-semibold text-testo-tenue hover:bg-white"
          aria-expanded={aperto}
          aria-controls={id}
          onClick={() => setAperto(!aperto)}
        >
          <SlidersHorizontal className="size-[18px]" aria-hidden="true" />
          Filtri{quanti > 0 && ` (${quanti})`}
        </button>
        {quanti > 0 && (
          <button
            type="button"
            className="min-h-11 rounded-[11px] px-2 text-montagna-scura underline"
            onClick={() => onCambia({ dislivello: { min: null, max: null } })}
          >
            Azzera
          </button>
        )}
      </div>
      {aperto && (
        <div id={id} className="mt-1 rounded-[11px] border border-bordo bg-white p-3">
          <Intervallo
            etichetta="Dislivello (m)"
            min={valori.dislivello.min}
            max={valori.dislivello.max}
            onCambia={(dislivello) => onCambia({ ...valori, dislivello })}
          />
          <p className="m-0 mt-2 text-xs text-testo-tenue">
            I trekking senza il dato restano visibili: i filtri nascondono solo chi è fuori dall'intervallo.
          </p>
        </div>
      )}
    </div>
  )
}

interface PropsIntervallo {
  etichetta: string
  min: number | null
  max: number | null
  onCambia: (intervallo: { min: number | null; max: number | null }) => void
}

/** Una coppia da / a: il campo vuoto vuol dire "nessun limite". */
function Intervallo({ etichetta, min, max, onCambia }: PropsIntervallo) {
  const id = useId()

  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-1 p-0 text-xs text-testo-tenue">{etichetta}</legend>
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor={`${id}-min`}>
          {etichetta}, da
        </label>
        <input
          id={`${id}-min`}
          type="number"
          inputMode="numeric"
          min={0}
          className="min-h-11 w-24 rounded-[11px] border border-bordo bg-white px-3 focus:outline-2 focus:-outline-offset-1 focus:outline-montagna"
          placeholder="da"
          value={testoLimite(min)}
          onChange={(evento) => onCambia({ min: limite(evento.target.value), max })}
        />
        <span className="text-testo-tenue">–</span>
        <label className="sr-only" htmlFor={`${id}-max`}>
          {etichetta}, a
        </label>
        <input
          id={`${id}-max`}
          type="number"
          inputMode="numeric"
          min={0}
          className="min-h-11 w-24 rounded-[11px] border border-bordo bg-white px-3 focus:outline-2 focus:-outline-offset-1 focus:outline-montagna"
          placeholder="a"
          value={testoLimite(max)}
          onChange={(evento) => onCambia({ min, max: limite(evento.target.value) })}
        />
      </div>
    </fieldset>
  )
}
