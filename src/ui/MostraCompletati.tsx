interface Props {
  acceso: boolean
  /** Quanti sono completati: se sono zero l'interruttore non serve. */
  quanti: number
  onCambia: (acceso: boolean) => void
}

/**
 * L'interruttore "Mostra completati" (docs/02-funzionalita.md): i completati
 * spariscono dall'elenco, questo li fa ricomparire. La scelta resta sul
 * dispositivo, in un cookie.
 */
export function MostraCompletati({ acceso, quanti, onCambia }: Props) {
  if (quanti === 0) return null

  return (
    <label className="flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-[11px] px-2 text-testo-tenue hover:bg-white">
      <input
        type="checkbox"
        className="size-[18px] accent-montagna"
        checked={acceso}
        onChange={(evento) => onCambia(evento.target.checked)}
      />
      Mostra completati ({quanti})
    </label>
  )
}
