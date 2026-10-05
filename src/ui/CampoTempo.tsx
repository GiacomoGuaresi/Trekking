import { useRef, useState, type Ref } from 'react'
import { normalizzaTempo, pulisciTempo, soloCifre, testoTempo, type TestoTempo } from '../dominio/tempo'

interface Props {
  /** L'id del campo delle ore; quello dei minuti finisce con `-minuti`. */
  id: string
  etichetta: string
  /** Nei filtri l'etichetta c'è già nella legenda: qui resta per i lettori di schermo. */
  etichettaNascosta?: boolean
  valore: TestoTempo
  onCambia: (tempo: TestoTempo) => void
  segnaposto?: TestoTempo
  storto?: boolean
}

/**
 * Un tempo in due campi collegati, [ore h | minuti min], con la tastiera
 * numerica. Due cifre nelle ore, o un separatore come `:`, portano ai minuti;
 * cancellando i minuti vuoti si torna alle ore. Uscendo dai minuti, quelli
 * oltre il cinquantanove passano alle ore (90 diventa 1 h 30).
 */
export function CampoTempo({ id, etichetta, etichettaNascosta, valore, onCambia, segnaposto, storto }: Props) {
  const ore = useRef<HTMLInputElement>(null)
  const minuti = useRef<HTMLInputElement>(null)

  const cambiaOre = (scritto: string) => {
    const cifre = soloCifre(scritto)
    onCambia({ ...valore, ore: cifre })
    const separatore = /\D/.test(scritto) && cifre !== ''
    if (separatore || (cifre.length === 2 && cifre.length > valore.ore.length)) minuti.current?.focus()
  }

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className={etichettaNascosta ? 'sr-only' : 'truncate text-sm font-semibold'} htmlFor={id}>
        {etichetta}
      </label>
      <div
        role="group"
        aria-label={etichetta}
        className={`flex min-h-11 items-stretch rounded-[11px] border bg-white focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-montagna ${
          storto ? 'border-pericolo' : 'border-bordo'
        }`}
      >
        <Parte
          ref={ore}
          id={id}
          nome="ore"
          unita="h"
          valore={valore.ore}
          segnaposto={segnaposto?.ore}
          storto={storto}
          onChange={cambiaOre}
        />
        <span className="my-2 w-px shrink-0 bg-bordo" aria-hidden="true" />
        <Parte
          ref={minuti}
          id={`${id}-minuti`}
          nome="minuti"
          unita="min"
          valore={valore.minuti}
          segnaposto={segnaposto?.minuti}
          storto={storto}
          onChange={(scritto) => onCambia({ ...valore, minuti: soloCifre(scritto) })}
          onBlur={() => onCambia(normalizzaTempo(valore))}
          onIndietro={() => ore.current?.focus()}
        />
      </div>
    </div>
  )
}

interface PropsParte {
  ref: Ref<HTMLInputElement>
  id: string
  nome: 'ore' | 'minuti'
  unita: string
  valore: string
  segnaposto?: string
  storto?: boolean
  onChange: (scritto: string) => void
  onBlur?: () => void
  /** Backspace sul campo vuoto. */
  onIndietro?: () => void
}

/** Metà del campo: un campo di testo con la tastiera numerica e l'unità dentro, a destra. */
function Parte({ ref, id, nome, unita, valore, segnaposto, storto, onChange, onBlur, onIndietro }: PropsParte) {
  return (
    <div className="relative min-w-0 flex-1">
      <input
        ref={ref}
        id={id}
        type="text"
        inputMode="numeric"
        enterKeyHint="next"
        autoComplete="off"
        aria-label={nome}
        aria-invalid={storto}
        className={`h-full w-full min-w-0 rounded-[11px] bg-transparent pl-3 focus:outline-none ${nome === 'ore' ? 'pr-6' : 'pr-9'}`}
        placeholder={segnaposto}
        value={valore}
        onChange={(evento) => onChange(evento.target.value)}
        onFocus={(evento) => evento.target.select()}
        onBlur={onBlur}
        onKeyDown={(evento) => {
          if (evento.key === 'Backspace' && valore === '' && onIndietro) {
            evento.preventDefault()
            onIndietro()
          }
        }}
      />
      <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-sm text-testo-tenue">
        {unita}
      </span>
    </div>
  )
}

interface PropsMinuti {
  id: string
  etichetta: string
  /** Il valore in minuti; `null` vuol dire campi vuoti. */
  minuti: number | null
  onCambia: (minuti: number | null) => void
  segnaposto?: TestoTempo
}

/**
 * Lo stesso campo per chi tiene i minuti come numero (i filtri): il testo vive
 * qui, e se il valore cambia da fuori (una scorciatoia, "Azzera") si riscrive.
 */
export function CampoTempoMinuti({ id, etichetta, minuti, onCambia, segnaposto }: PropsMinuti) {
  const [testo, setTesto] = useState(() => testoTempo(minuti))
  if (pulisciTempo(testo) !== minuti) setTesto(testoTempo(minuti))

  return (
    <CampoTempo
      id={id}
      etichetta={etichetta}
      etichettaNascosta
      valore={testo}
      segnaposto={segnaposto}
      onCambia={(nuovo) => {
        setTesto(nuovo)
        onCambia(pulisciTempo(nuovo))
      }}
    />
  )
}
