import { ArrowDown, ArrowUp, Check, Pencil, Trash2 } from 'lucide-react'
import type { Colonna, Ordinamento } from '../dominio/ordinamento'
import type { Trekking } from '../dominio/tipi'

interface Props {
  /** Solo quelli da mostrare: completati, ricerca e ordinamento sono già stati applicati. */
  trekking: readonly Trekking[]
  ordinamento: Ordinamento
  onOrdina: (colonna: Colonna) => void
  /** Il testo cercato: cambia il messaggio quando non si trova nulla. */
  ricerca: string
  /** Quanti sono nascosti perché completati: cambia il messaggio dell'elenco vuoto. */
  nascosti: number
  onNuovo: () => void
  onCompletato: (trekking: Trekking) => void
  onRinomina: (trekking: Trekking) => void
  onElimina: (trekking: Trekking) => void
}

const data = new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })

/**
 * L'elenco dei trekking (docs/09-interfaccia.md): il segno del completato, il
 * nome, la data di aggiunta e i pulsanti per cambiare il nome o eliminare.
 * Toccando un'intestazione si ordina per quella colonna, un secondo tocco
 * inverte. Le altre colonne e i filtri arrivano con gli step successivi.
 */
export function Elenco({
  trekking,
  ordinamento,
  onOrdina,
  ricerca,
  nascosti,
  onNuovo,
  onCompletato,
  onRinomina,
  onElimina,
}: Props) {
  if (trekking.length === 0) {
    if (ricerca.trim() !== '') {
      return <p className="mt-8 text-center text-testo-tenue">Nessun trekking con questo nome.</p>
    }
    if (nascosti > 0) {
      return <p className="mt-8 text-center text-testo-tenue">Sono tutti completati.</p>
    }
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
    <div className="overflow-x-auto rounded-[11px] border border-bordo bg-white">
      <table className="w-full min-w-[420px] border-collapse text-left">
        <thead>
          <tr className="border-b border-bordo">
            <th className="w-11">
              <span className="sr-only">Completato</span>
            </th>
            <Intestazione colonna="nome" etichetta="Nome" ordinamento={ordinamento} onOrdina={onOrdina} />
            <Intestazione
              colonna="creato_il"
              etichetta="Aggiunto"
              ordinamento={ordinamento}
              onOrdina={onOrdina}
              stretta
            />
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
                  className="grid size-11 place-items-center rounded-full hover:bg-fondo"
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
              <td className="px-3 py-2 whitespace-nowrap text-testo-tenue">{data.format(new Date(t.creato_il))}</td>
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
    </div>
  )
}

interface PropsIntestazione {
  colonna: Colonna
  etichetta: string
  ordinamento: Ordinamento
  onOrdina: (colonna: Colonna) => void
  stretta?: boolean
}

/** Un'intestazione su cui si può toccare per ordinare, con la freccia del verso. */
function Intestazione({ colonna, etichetta, ordinamento, onOrdina, stretta = false }: PropsIntestazione) {
  const attiva = ordinamento.colonna === colonna
  const Freccia = ordinamento.verso === 'crescente' ? ArrowUp : ArrowDown

  return (
    <th
      className={stretta ? 'w-px' : undefined}
      aria-sort={attiva ? (ordinamento.verso === 'crescente' ? 'ascending' : 'descending') : 'none'}
    >
      <button
        type="button"
        className="flex min-h-11 w-full items-center gap-1 px-3 font-semibold whitespace-nowrap hover:bg-fondo"
        onClick={() => onOrdina(colonna)}
      >
        {etichetta}
        {attiva && <Freccia className="size-[15px] text-montagna-scura" aria-hidden="true" />}
      </button>
    </th>
  )
}
