import type { Trekking } from '../dominio/tipi'

/**
 * L'elenco dei trekking (docs/09-interfaccia.md): per ora una tabella con il
 * solo nome. Le altre colonne, la ricerca, i filtri e l'ordinamento arrivano
 * con gli step successivi della roadmap.
 */
export function Elenco({ trekking, onNuovo }: { trekking: readonly Trekking[]; onNuovo: () => void }) {
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
        </tr>
      </thead>
      <tbody>
        {trekking.map((t) => (
          <tr key={t.id} className="border-b border-bordo last:border-0">
            <td className="px-3 py-2">{t.nome}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
