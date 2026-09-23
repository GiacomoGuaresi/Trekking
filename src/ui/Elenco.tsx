import { Check, Pencil, Trash2 } from 'lucide-react'
import type { Trekking } from '../dominio/tipi'

interface Props {
  /** Solo quelli da mostrare: il filtro dei completati è già stato applicato. */
  trekking: readonly Trekking[]
  onNuovo: () => void
  /** Quanti sono nascosti perché completati: cambia il messaggio dell'elenco vuoto. */
  nascosti: number
  onCompletato: (trekking: Trekking) => void
  onRinomina: (trekking: Trekking) => void
  onElimina: (trekking: Trekking) => void
}

/**
 * L'elenco dei trekking (docs/09-interfaccia.md): il segno del completato, il
 * nome e, in fondo alla riga, i pulsanti per cambiarlo o eliminare. Le altre
 * colonne, la ricerca, i filtri e l'ordinamento arrivano con gli step
 * successivi della roadmap.
 */
export function Elenco({ trekking, onNuovo, nascosti, onCompletato, onRinomina, onElimina }: Props) {
  if (trekking.length === 0 && nascosti > 0) {
    return <p className="mt-8 text-center text-testo-tenue">Sono tutti completati.</p>
  }

  if (trekking.length === 0) {
    return (
      <p className="mt-8 text-center text-testo-tenue">
        Nessun trekking.{' '}
        <button type="button" className="font-semibold text-montagna-scura underline" onClick={onNuovo}>
          Aggiungi il primo
        </button>
        .
      </p>
    )
  }

  return (
    <table className="w-full border-collapse overflow-hidden rounded-[11px] border border-bordo bg-white text-left">
      <thead>
        <tr className="border-b border-bordo">
          <th className="w-11">
            <span className="sr-only">Completato</span>
          </th>
          <th className="px-3 py-2 font-semibold">Nome</th>
          <th className="w-24">
            <span className="sr-only">Azioni</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {trekking.map((t) => (
          <tr key={t.id} className="border-b border-bordo last:border-0">
            <td className="py-1 pl-1">
              <button
                type="button"
                className={`grid size-11 place-items-center rounded-full ${
                  t.completato ? 'text-montagna-scura' : 'text-testo-tenue'
                } hover:bg-fondo`}
                aria-pressed={t.completato}
                aria-label={t.completato ? `Togli il completato a ${t.nome}` : `Segna ${t.nome} come completato`}
                onClick={() => onCompletato(t)}
              >
                <span
                  className={`grid size-[22px] place-items-center rounded-full border ${
                    t.completato ? 'border-montagna-scura bg-montagna-scura text-panna' : 'border-bordo'
                  }`}
                >
                  {t.completato && <Check className="size-[15px]" aria-hidden="true" />}
                </span>
              </button>
            </td>
            <td className={`px-3 py-2 ${t.completato ? 'text-testo-tenue line-through' : ''}`}>{t.nome}</td>
            <td className="py-1 pr-1">
              <div className="flex justify-end gap-0.5">
                <button
                  type="button"
                  className="grid size-11 place-items-center rounded-[11px] text-testo-tenue hover:bg-fondo"
                  aria-label={`Cambia il nome di ${t.nome}`}
                  onClick={() => onRinomina(t)}
                >
                  <Pencil className="size-[18px]" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="grid size-11 place-items-center rounded-[11px] text-testo-tenue hover:bg-fondo hover:text-pericolo"
                  aria-label={`Elimina ${t.nome}`}
                  onClick={() => onElimina(t)}
                >
                  <Trash2 className="size-[18px]" aria-hidden="true" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
