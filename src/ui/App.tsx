import { useCallback, useState } from 'react'
import { Menu, MountainSnow, Plus } from 'lucide-react'
import type { Trekking } from '../dominio/tipi'
import { Conferma } from './Conferma'
import { Elenco } from './Elenco'
import { MenuLaterale } from './MenuLaterale'
import { ModaleNome } from './ModaleNome'
import { useRotta } from './rotta'
import { useTrekking } from './useTrekking'

/**
 * Il guscio dell'app, come Grocery e Projects (docs/09-interfaccia.md):
 * intestazione blu montagna da bordo a bordo con ☰ a sinistra e + a destra,
 * menu laterale, contenuto largo al massimo 1200px. Da 1024px il menu è una
 * colonna fissa e ☰ sparisce.
 */
export function App() {
  const rotta = useRotta()
  const [menuAperto, setMenuAperto] = useState(false)
  const [nuovoAperto, setNuovoAperto] = useState(false)
  /** Il trekking di cui si sta cambiando il nome, e quello che si sta eliminando. */
  const [daRinominare, setDaRinominare] = useState<Trekking | null>(null)
  const [daEliminare, setDaEliminare] = useState<Trekking | null>(null)
  const [erroreEliminazione, setErroreEliminazione] = useState<string | null>(null)
  const chiudiMenu = useCallback(() => setMenuAperto(false), [])
  const { stato, ricarica, crea, rinomina, elimina } = useTrekking()

  const chiudiEliminazione = () => {
    setDaEliminare(null)
    setErroreEliminazione(null)
  }

  const confermaEliminazione = async () => {
    if (!daEliminare) return
    setErroreEliminazione(null)
    try {
      await elimina(daEliminare.id)
      setDaEliminare(null)
    } catch (e) {
      setErroreEliminazione((e as Error).message)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col lg:grid lg:grid-cols-[256px_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">
      <header className="sticky top-0 z-1 flex items-center gap-1 border-b border-montagna-scura bg-montagna pt-[env(safe-area-inset-top)] pr-2 pl-1 text-panna lg:col-span-full lg:min-h-11 lg:pl-3">
        <button
          className="grid size-11 place-items-center rounded-[11px] active:bg-montagna-scura lg:hidden"
          type="button"
          aria-label="Apri il menu"
          aria-expanded={menuAperto}
          aria-controls="menu"
          onClick={() => setMenuAperto(true)}
        >
          <Menu className="size-[22px]" aria-hidden="true" />
        </button>
        <MountainSnow className="size-[22px] shrink-0" aria-hidden="true" />
        <h1 className="ml-1 text-lg font-semibold tracking-[0.01em]">Trekking</h1>
        <button
          className="ml-auto flex min-h-9 items-center gap-1.5 rounded-[11px] px-2.5 font-semibold hover:bg-montagna-scura active:bg-montagna-scura"
          type="button"
          aria-label="Nuovo trekking"
          onClick={() => setNuovoAperto(true)}
        >
          <Plus className="size-[22px]" aria-hidden="true" />
          <span className="hidden lg:inline">Nuovo trekking</span>
        </button>
      </header>
      <MenuLaterale
        aperto={menuAperto}
        corrente={rotta}
        onChiudi={chiudiMenu}
        onNuovo={() => {
          setMenuAperto(false)
          setNuovoAperto(true)
        }}
      />
      <main className="mx-auto w-full max-w-[1200px] flex-1 p-3 pb-[calc(12px+env(safe-area-inset-bottom))] lg:col-start-2">
        {stato.fase === 'caricamento' && <p className="mt-8 text-center text-testo-tenue">Carico…</p>}
        {stato.fase === 'errore' && (
          <p className="mt-8 text-center text-testo-tenue" role="alert">
            {stato.messaggio}{' '}
            <button type="button" className="font-semibold text-montagna-scura underline" onClick={() => void ricarica()}>
              Riprova
            </button>
          </p>
        )}
        {stato.fase === 'pronto' && (
          <Elenco
            trekking={stato.trekking}
            onNuovo={() => setNuovoAperto(true)}
            onRinomina={setDaRinominare}
            onElimina={(t) => {
              setErroreEliminazione(null)
              setDaEliminare(t)
            }}
          />
        )}
      </main>
      {nuovoAperto && (
        <ModaleNome titolo="Nuovo trekking" onSalva={crea} onChiudi={() => setNuovoAperto(false)} />
      )}
      {daRinominare && (
        <ModaleNome
          titolo="Cambia nome"
          nomeIniziale={daRinominare.nome}
          onSalva={(nome) => rinomina(daRinominare.id, nome)}
          onChiudi={() => setDaRinominare(null)}
        />
      )}
      {daEliminare && (
        <Conferma
          titolo="Elimina trekking"
          conferma="Elimina"
          pericolo
          onConferma={() => void confermaEliminazione()}
          onAnnulla={chiudiEliminazione}
        >
          <p className="m-0">
            Elimino <strong>{daEliminare.nome}</strong>? Non si torna indietro.
          </p>
          {erroreEliminazione && (
            <p className="mt-2 mb-0 text-xs text-pericolo" role="alert">
              {erroreEliminazione}
            </p>
          )}
        </Conferma>
      )}
    </div>
  )
}
