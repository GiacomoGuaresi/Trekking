import { Pencil, Trash2 } from 'lucide-react'
import type { Trekking } from '../dominio/tipi'

interface Props {
  trekking: readonly Trekking[]
  onNuovo: () => void
  onRinomina: (trekking: Trekking) => void
  onElimina: (trekking: Trekking) => void
}

/**
 * L'elenco dei trekking (docs/09-interfaccia.md): per ora il nome e, in fondo
 * alla riga, i pulsanti per cambiarlo o eliminare. Le altre colonne, la ricerca,
 * i filtri e l'ordinamento arrivano con gli step successivi della roadmap.
 */
export function Elenco({ trekking, onNuovo, onRinomina, onElimina }: Props) {
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
          <th className="px-3 py-2 font-semibold">Nome</th>
          <th className="w-24">
            <span className="sr-only">Azioni</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {trekking.map((t) => (
          <tr key={t.id} className="border-b border-bordo last:border-0">
            <td className="px-3 py-2">{t.nome}</td>
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
