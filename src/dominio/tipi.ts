/** Le righe di `trekking.trekking` (docs/08-modello-dati.md). Le colonne
 *  arrivano con gli step della roadmap che le usano: per ora il nome, i link,
 *  le note, il dislivello, la durata e il segno "completato". */
export interface Trekking {
  id: string
  nome: string
  link: string[]
  note: string | null
  /** Metri di salita, intero positivo; `null` quando non si sa. */
  dislivello: number | null
  /** Ore di andata e ritorno, a passi di mezz'ora; `null` quando non si sa. */
  durata_ore: number | null
  completato: boolean
  creato_il: string
  modificato_il: string
}

/** Quello che si scrive nel form: le colonne che l'app salva (docs/02-funzionalita.md). */
export interface CampiTrekking {
  nome: string
  link: string[]
  /** Markdown; vuoto vuol dire `null`. */
  note: string | null
  dislivello: number | null
  durata_ore: number | null
}
