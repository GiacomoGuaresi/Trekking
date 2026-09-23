import { SlidersHorizontal } from 'lucide-react'
import { useId, useState } from 'react'
import { FILTRI_VUOTI, type Filtri as Valori, limite, quantiFiltri, testoLimite } from '../dominio/filtri'

interface Props {
  valori: Valori
  onCambia: (valori: Valori) => void
  /** La distanza si filtra solo se la posizione di casa è stata inserita. */
  conDistanza: boolean
}

/**
 * I filtri dell'elenco (docs/02-funzionalita.md): un pulsante che dice quanti
 * limiti sono accesi e apre il pannello: dislivello, durata, distanza da casa e
 * tempo di viaggio.
 */
export function Filtri({ valori, onCambia, conDistanza }: Props) {
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
            onClick={() => onCambia(FILTRI_VUOTI)}
          >
            Azzera
          </button>
        )}
      </div>
      {aperto && (
        <div
          id={id}
          className="mt-1 flex animate-entra flex-wrap gap-x-6 gap-y-3 rounded-[11px] border border-bordo bg-white p-3"
        >
          <Intervallo
            etichetta="Dislivello (m)"
            min={valori.dislivello.min}
            max={valori.dislivello.max}
            onCambia={(dislivello) => onCambia({ ...valori, dislivello })}
          />
          <Intervallo
            etichetta="Durata (ore)"
            passo={0.5}
            min={valori.durata.min}
            max={valori.durata.max}
            onCambia={(durata) => onCambia({ ...valori, durata })}
          />
          {conDistanza && (
            <Intervallo
              etichetta="Distanza da casa (km)"
              soloMassimo
              min={valori.distanza.min}
              max={valori.distanza.max}
              onCambia={(distanza) => onCambia({ ...valori, distanza })}
            />
          )}
          <Intervallo
            etichetta="Viaggio (minuti)"
            passo={5}
            soloMassimo
            min={valori.viaggio.min}
            max={valori.viaggio.max}
            onCambia={(viaggio) => onCambia({ ...valori, viaggio })}
          />
          <p className="m-0 w-full text-xs text-testo-tenue">
            I trekking senza il dato restano visibili: i filtri nascondono solo chi è fuori dall'intervallo.
          </p>
        </div>
      )}
    </div>
  )
}

interface PropsIntervallo {
  etichetta: string
  /** Di quanto sale e scende il campo: le ore vanno a mezz'ore. */
  passo?: number
  /** Per la distanza da casa conta solo quanto lontano si è disposti ad andare. */
  soloMassimo?: boolean
  min: number | null
  max: number | null
  onCambia: (intervallo: { min: number | null; max: number | null }) => void
}

/** Una coppia da / a: il campo vuoto vuol dire "nessun limite". */
function Intervallo({ etichetta, passo = 1, soloMassimo = false, min, max, onCambia }: PropsIntervallo) {
  const id = useId()

  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-1 p-0 text-xs text-testo-tenue">{etichetta}</legend>
      <div className="flex items-center gap-2">
        {!soloMassimo && (
          <>
            <label className="sr-only" htmlFor={`${id}-min`}>
              {etichetta}, da
            </label>
            <input
              id={`${id}-min`}
              type="number"
              inputMode="decimal"
              min={0}
              step={passo}
              className="min-h-11 w-24 rounded-[11px] border border-bordo bg-white px-3 focus:outline-2 focus:-outline-offset-1 focus:outline-montagna"
              placeholder="da"
              value={testoLimite(min)}
              onChange={(evento) => onCambia({ min: limite(evento.target.value), max })}
            />
            <span className="text-testo-tenue">–</span>
          </>
        )}
        <label className="sr-only" htmlFor={`${id}-max`}>
          {etichetta}, {soloMassimo ? 'al massimo' : 'a'}
        </label>
        <input
          id={`${id}-max`}
          type="number"
          inputMode="decimal"
          min={0}
          step={passo}
          className="min-h-11 w-24 rounded-[11px] border border-bordo bg-white px-3 focus:outline-2 focus:-outline-offset-1 focus:outline-montagna"
          placeholder={soloMassimo ? 'al massimo' : 'a'}
          value={testoLimite(max)}
          onChange={(evento) => onCambia({ min, max: limite(evento.target.value) })}
        />
      </div>
    </fieldset>
  )
}
