import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { dislivelloValido, pulisciDislivello, testoDislivello } from '../dominio/dislivello'
import { coordinateValide } from '../dominio/coordinate'
import { durataValida, pulisciDurata, testoDurata } from '../dominio/durata'
import { pulisciLink } from '../dominio/link'
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
  /** Solo in modifica: in fondo al form compare "Elimina trekking". */
  onElimina?: () => void
}

const CAMPO =
  'min-h-11 w-full rounded-[11px] border border-bordo bg-white px-3 focus:outline-2 focus:-outline-offset-1 focus:outline-montagna'


/**
 * Il form del trekking (docs/02-funzionalita.md, inserimento rapido), pensato
 * per il telefono: a schermo intero, con i campi in tre gruppi (dove, quanto,
 * link e note), tastiere numeriche per i numeri e "Salva" sempre in vista in
 * fondo. Serve solo il nome; il luogo si scrive per nome o per coordinate, i
 * link uno per campo, le note in Markdown.
 */
export function ModaleTrekking({ titolo, iniziale, esistenti, escludi, onSalva, onChiudi, onElimina }: Props) {
  const [nome, setNome] = useState(iniziale?.nome ?? '')
  const [link, setLink] = useState<string[]>(() => (iniziale?.link.length ? [...iniziale.link] : ['']))
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
  const valido =
    nomeValido(nome) && dislivelloValido(dislivello) && durataValida(durata) && luogoValido && viaggioValido(viaggio)

  const invia = async (evento: FormEvent) => {
    evento.preventDefault()
    if (!valido || inCorso) return
    setInCorso(true)
    setErrore(null)
    const minuti = pulisciViaggio(viaggio)
    try {
      const salvato = await risolviLuogo(luogo)
      await onSalva({
        nome: pulisciNome(nome),
        link: pulisciLink(link.join('\n')),
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

  const cambiaLink = (indice: number, valore: string) =>
    setLink((prima) => prima.map((l, i) => (i === indice ? valore : l)))
  const togliLink = (indice: number) =>
    setLink((prima) => (prima.length === 1 ? [''] : prima.filter((_, i) => i !== indice)))

  return (
    <Modale
      titolo={titolo}
      onChiudi={onChiudi}
      mobile="schermoIntero"
      piede={
        <>
          {errore && (
            <p className="m-0 w-full text-xs text-pericolo" role="alert">
              {errore}
            </p>
          )}
          <button
            type="button"
            className="min-h-11 flex-1 rounded-[11px] border border-bordo px-4 font-semibold text-testo-tenue hover:bg-fondo sm:flex-none sm:border-0"
            onClick={onChiudi}
          >
            Annulla
          </button>
          <button
            type="submit"
            form={id}
            className="min-h-11 flex-[2] rounded-[11px] bg-montagna px-4 font-semibold text-panna hover:bg-montagna-scura disabled:opacity-50 sm:flex-none"
            disabled={!valido || inCorso}
          >
            {inCorso ? 'Salvo…' : 'Salva'}
          </button>
        </>
      }
    >
      <form id={id} className="flex flex-col gap-6" onSubmit={invia}>
        <Gruppo titolo="Dove">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" htmlFor={`${id}-nome`}>
              Nome
            </label>
            <input
              id={`${id}-nome`}
              className={CAMPO}
              // Solo per un trekking nuovo: in modifica la tastiera coprirebbe metà form.
              autoFocus={!iniziale}
              autoCapitalize="sentences"
              enterKeyHint="next"
              placeholder="Pizzo Coca"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
            />
            {gia && (
              <p className="m-0 text-xs text-testo-tenue">
                Esiste già un trekking che si chiama <strong>{gia.nome}</strong>.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <CampoLuogo valore={luogo} onCambia={setLuogo} />
          </div>
        </Gruppo>

        <Gruppo titolo="Quanto">
          <div className="grid grid-cols-3 gap-2">
            <CampoNumero
              id={`${id}-dislivello`}
              etichetta="Dislivello"
              unita="m"
              inputMode="numeric"
              placeholder="1200"
              valore={dislivello}
              onCambia={setDislivello}
              storto={!dislivelloValido(dislivello)}
            />
            <CampoNumero
              id={`${id}-durata`}
              etichetta="Durata A/R"
              unita="h"
              inputMode="decimal"
              placeholder="3,5"
              valore={durata}
              onCambia={setDurata}
              storto={!durataValida(durata)}
            />
            <CampoNumero
              id={`${id}-viaggio`}
              etichetta="Viaggio"
              unita="min"
              inputMode="numeric"
              placeholder="90"
              valore={viaggio}
              onCambia={setViaggio}
              storto={!viaggioValido(viaggio)}
            />
          </div>
          {!dislivelloValido(dislivello) && (
            <p className="m-0 text-xs text-pericolo">Il dislivello sono metri interi, sopra lo zero.</p>
          )}
          {!durataValida(durata) && (
            <p className="m-0 text-xs text-pericolo">La durata va a mezz'ore: 3 o 3,5, non 3,2.</p>
          )}
          {viaggioValido(viaggio) ? (
            <p className="m-0 text-xs text-testo-tenue">
              Il viaggio anche come 1:30. Scritto a mano non verrà ricalcolato.
            </p>
          ) : (
            <p className="m-0 text-xs text-pericolo">Il viaggio in minuti (90) oppure ore e minuti (1:30).</p>
          )}
        </Gruppo>

        <Gruppo titolo="Link">
          {link.map((indirizzo, indice) => (
            <div key={indice} className="flex items-center gap-1">
              <label className="sr-only" htmlFor={`${id}-link-${indice}`}>
                Link {indice + 1}
              </label>
              <input
                id={`${id}-link-${indice}`}
                type="url"
                inputMode="url"
                autoCapitalize="off"
                autoCorrect="off"
                className={CAMPO}
                placeholder="https://www.komoot.com/tour/..."
                value={indirizzo}
                onChange={(evento) => cambiaLink(indice, evento.target.value)}
              />
              {(link.length > 1 || indirizzo !== '') && (
                <button
                  type="button"
                  className="grid size-11 shrink-0 place-items-center rounded-[11px] text-testo-tenue hover:bg-fondo"
                  aria-label={`Togli il link ${indice + 1}`}
                  onClick={() => togliLink(indice)}
                >
                  <X className="size-[18px]" aria-hidden="true" />
                </button>
              )}
            </div>
          ))}
          {link[link.length - 1].trim() !== '' && (
            <button
              type="button"
              className="flex min-h-11 w-fit items-center gap-1.5 rounded-[11px] px-2 font-semibold text-montagna-scura hover:bg-fondo"
              onClick={() => setLink((prima) => [...prima, ''])}
            >
              <Plus className="size-[18px]" aria-hidden="true" />
              Aggiungi un link
            </button>
          )}
        </Gruppo>

        <Gruppo titolo="Note">
          <EditorMarkdown valore={note} onCambia={setNote} etichetta="Note" righe={5} />
        </Gruppo>

        {onElimina && (
          <button
            type="button"
            className="flex min-h-11 w-fit items-center gap-1.5 self-center rounded-[11px] px-3 font-semibold text-pericolo hover:bg-fondo"
            onClick={onElimina}
          >
            <Trash2 className="size-[18px]" aria-hidden="true" />
            Elimina trekking
          </button>
        )}
      </form>
    </Modale>
  )
}

/** Un gruppo di campi con il suo titolo piccolo, come le sezioni dei dettagli. */
function Gruppo({ titolo, children }: { titolo: string; children: ReactNode }) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
      <legend className="mb-2 p-0 text-xs font-semibold tracking-wide text-testo-tenue uppercase">{titolo}</legend>
      {children}
    </fieldset>
  )
}

interface PropsNumero {
  id: string
  etichetta: string
  /** L'unità scritta dentro il campo, a destra. */
  unita: string
  inputMode: 'numeric' | 'decimal'
  placeholder: string
  valore: string
  onCambia: (testo: string) => void
  storto: boolean
}

/**
 * Un numero con la sua unità. È un campo di testo con la tastiera numerica: con
 * `type="number"` la virgola italiana di iOS si perderebbe.
 */
function CampoNumero({ id, etichetta, unita, inputMode, placeholder, valore, onCambia, storto }: PropsNumero) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className="truncate text-sm font-semibold" htmlFor={id}>
        {etichetta}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          enterKeyHint="next"
          aria-invalid={storto}
          className={`${CAMPO} pr-10 ${storto ? 'border-pericolo' : ''}`}
          placeholder={placeholder}
          value={valore}
          onChange={(evento) => onCambia(evento.target.value)}
        />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-testo-tenue">
          {unita}
        </span>
      </div>
    </div>
  )
}
