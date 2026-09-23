import { useId, useState, type FormEvent } from 'react'
import { dislivelloValido, pulisciDislivello, testoDislivello } from '../dominio/dislivello'
import { coordinateValide } from '../dominio/coordinate'
import { durataValida, pulisciDurata, testoDurata } from '../dominio/durata'
import { pulisciLink, righeLink } from '../dominio/link'
import { nomeValido, pulisciNome } from '../dominio/nome'
import { doppione } from '../dominio/ricerca'
import { pulisciViaggio, testoViaggio, viaggioManuale, viaggioValido } from '../dominio/viaggio'
import type { CampiTrekking, Trekking } from '../dominio/tipi'
import { EditorMarkdown } from './EditorMarkdown'
import { CampoLuogo } from './CampoLuogo'
import { Modale } from './Modale'
import { risolviLuogo, statoLuogoIniziale } from './luogo'

interface Props {
  /** "Nuovo trekking" quando si crea, "Modifica trekking" quando si cambia. */
  titolo: string
  iniziale?: CampiTrekking
  /** Tutti i trekking, per avvisare dei doppioni mentre si scrive. */
  esistenti: readonly Trekking[]
  /** Il trekking che si sta modificando: non è doppione di sé stesso. */
  escludi?: string
  onSalva: (campi: CampiTrekking) => Promise<unknown>
  onChiudi: () => void
}

/**
 * Il form del trekking (docs/02-funzionalita.md, inserimento rapido): il nome,
 * obbligatorio, il luogo per nome o per coordinate, il dislivello, la durata, il
 * tempo di viaggio, i link (uno per riga) e le note in Markdown. Gli
 * altri campi si aggiungono qui con gli step della roadmap. Invio salva; a
 * schermo intero su mobile.
 */
export function ModaleTrekking({ titolo, iniziale, esistenti, escludi, onSalva, onChiudi }: Props) {
  const [nome, setNome] = useState(iniziale?.nome ?? '')
  const [link, setLink] = useState(righeLink(iniziale?.link ?? []))
  const [note, setNote] = useState(iniziale?.note ?? '')
  const [dislivello, setDislivello] = useState(testoDislivello(iniziale?.dislivello ?? null))
  const [durata, setDurata] = useState(testoDurata(iniziale?.durata_ore ?? null))
  const [luogo, setLuogo] = useState(() => statoLuogoIniziale(iniziale))
  const [viaggio, setViaggio] = useState(testoViaggio(iniziale?.viaggio_minuti ?? null))
  const [inCorso, setInCorso] = useState(false)
  const [errore, setErrore] = useState<string | null>(null)
  const id = useId()
  // L'avviso compare mentre si scrive e non blocca il salvataggio
  // (docs/02-funzionalita.md).
  const gia = doppione(esistenti, nome, escludi)
  /** Le coordinate incollate storte fermano il salvataggio; il nome no. */
  const luogoValido = luogo.modo === 'nome' || coordinateValide(luogo.coordinate)

  const invia = async (evento: FormEvent) => {
    evento.preventDefault()
    if (!nomeValido(nome) || !dislivelloValido(dislivello) || !durataValida(durata) || !luogoValido) return
    if (!viaggioValido(viaggio)) return
    if (inCorso) return
    setInCorso(true)
    setErrore(null)
    const minuti = pulisciViaggio(viaggio)
    try {
      const salvato = await risolviLuogo(luogo)
      await onSalva({
        nome: pulisciNome(nome),
        link: pulisciLink(link),
        note: note.trim() === '' ? null : note,
        dislivello: pulisciDislivello(dislivello),
        durata_ore: pulisciDurata(durata),
        viaggio_minuti: minuti,
        viaggio_manuale: viaggioManuale(minuti, iniziale ?? null),
        ...salvato,
      })
      onChiudi()
    } catch (e) {
      setErrore((e as Error).message)
      setInCorso(false)
    }
  }

  return (
    <Modale
      titolo={titolo}
      onChiudi={onChiudi}
      schermoInteroMobile
      piede={
        <>
          <button
            type="button"
            className="min-h-11 rounded-[11px] px-4 font-semibold text-testo-tenue hover:bg-fondo"
            onClick={onChiudi}
          >
            Annulla
          </button>
          <button
            type="submit"
            form={id}
            className="min-h-11 rounded-[11px] bg-montagna px-4 font-semibold text-panna hover:bg-montagna-scura disabled:opacity-50"
            disabled={
              !nomeValido(nome) ||
              !dislivelloValido(dislivello) ||
              !durataValida(durata) ||
              !luogoValido ||
              !viaggioValido(viaggio) ||
              inCorso
            }
          >
            {inCorso ? 'Salvo…' : 'Salva'}
          </button>
        </>
      }
    >
      <form id={id} className="flex flex-col gap-2" onSubmit={invia}>
        <label className="text-xs text-testo-tenue" htmlFor={`${id}-nome`}>
          Nome
        </label>
        <input
          id={`${id}-nome`}
          className="min-h-11 w-full rounded-[11px] border border-bordo bg-white px-3 focus:outline-2 focus:-outline-offset-1 focus:outline-montagna"
          autoFocus
          value={nome}
          onChange={(evento) => setNome(evento.target.value)}
        />
        {gia && (
          <p className="m-0 text-xs text-testo-tenue">
            Esiste già un trekking che si chiama <strong>{gia.nome}</strong>.
          </p>
        )}
        <CampoLuogo valore={luogo} onCambia={setLuogo} />
        <label className="mt-2 text-xs text-testo-tenue" htmlFor={`${id}-dislivello`}>
          Dislivello (m)
        </label>
        <input
          id={`${id}-dislivello`}
          type="number"
          inputMode="numeric"
          min={1}
          className="min-h-11 w-32 rounded-[11px] border border-bordo bg-white px-3 focus:outline-2 focus:-outline-offset-1 focus:outline-montagna"
          placeholder="1200"
          value={dislivello}
          onChange={(evento) => setDislivello(evento.target.value)}
        />
        {!dislivelloValido(dislivello) && (
          <p className="m-0 text-xs text-pericolo">Il dislivello sono metri interi, sopra lo zero.</p>
        )}
        <label className="mt-2 text-xs text-testo-tenue" htmlFor={`${id}-durata`}>
          Durata (ore, andata e ritorno)
        </label>
        <input
          id={`${id}-durata`}
          type="number"
          inputMode="decimal"
          min={0.5}
          step={0.5}
          className="min-h-11 w-32 rounded-[11px] border border-bordo bg-white px-3 focus:outline-2 focus:-outline-offset-1 focus:outline-montagna"
          placeholder="3.5"
          value={durata}
          onChange={(evento) => setDurata(evento.target.value)}
        />
        {!durataValida(durata) && (
          <p className="m-0 text-xs text-pericolo">La durata va a mezz'ore: 3 o 3.5, non 3.2.</p>
        )}
        <label className="mt-2 text-xs text-testo-tenue" htmlFor={`${id}-viaggio`}>
          Tempo di viaggio (minuti)
        </label>
        <input
          id={`${id}-viaggio`}
          inputMode="numeric"
          className="min-h-11 w-32 rounded-[11px] border border-bordo bg-white px-3 focus:outline-2 focus:-outline-offset-1 focus:outline-montagna"
          placeholder="90"
          value={viaggio}
          onChange={(evento) => setViaggio(evento.target.value)}
        />
        {viaggioValido(viaggio) ? (
          <p className="m-0 text-xs text-testo-tenue">Anche come 1:30. Scrivendolo a mano non verrà ricalcolato.</p>
        ) : (
          <p className="m-0 text-xs text-pericolo">Minuti (90) oppure ore e minuti (1:30).</p>
        )}
        <label className="mt-2 text-xs text-testo-tenue" htmlFor={`${id}-link`}>
          Link (uno per riga)
        </label>
        <textarea
          id={`${id}-link`}
          rows={3}
          className="w-full resize-y rounded-[11px] border border-bordo bg-white p-3 focus:outline-2 focus:-outline-offset-1 focus:outline-montagna"
          placeholder="https://www.komoot.com/tour/..."
          value={link}
          onChange={(evento) => setLink(evento.target.value)}
        />
        <span className="mt-2 text-xs text-testo-tenue">Note</span>
        <EditorMarkdown valore={note} onCambia={setNote} etichetta="Note" righe={6} />
        {errore && (
          <p className="m-0 text-xs text-pericolo" role="alert">
            {errore}
          </p>
        )}
      </form>
    </Modale>
  )
}
