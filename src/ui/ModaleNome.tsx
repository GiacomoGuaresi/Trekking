import { useId, useState, type FormEvent } from 'react'
import { nomeValido, pulisciNome } from '../dominio/nome'
import { Modale } from './Modale'

interface Props {
  /** "Nuovo trekking" quando si crea, "Cambia nome" quando si modifica. */
  titolo: string
  nomeIniziale?: string
  onSalva: (nome: string) => Promise<unknown>
  onChiudi: () => void
}

/**
 * Il modale del nome (docs/02-funzionalita.md, inserimento rapido): serve sia a
 * creare sia a rinominare. Per ora il solo nome, che basta a salvare: gli altri
 * campi si aggiungono qui con gli step della roadmap. Invio salva; a schermo
 * intero su mobile.
 */
export function ModaleNome({ titolo, nomeIniziale = '', onSalva, onChiudi }: Props) {
  const [nome, setNome] = useState(nomeIniziale)
  const [inCorso, setInCorso] = useState(false)
  const [errore, setErrore] = useState<string | null>(null)
  const id = useId()

  const invia = async (evento: FormEvent) => {
    evento.preventDefault()
    if (!nomeValido(nome) || inCorso) return
    setInCorso(true)
    setErrore(null)
    try {
      await onSalva(pulisciNome(nome))
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
            disabled={!nomeValido(nome) || inCorso}
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
        {errore && (
          <p className="m-0 text-xs text-pericolo" role="alert">
            {errore}
          </p>
        )}
      </form>
    </Modale>
  )
}
