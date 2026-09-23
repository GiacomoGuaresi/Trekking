/** Le righe di `trekking.trekking` (docs/08-modello-dati.md). Le colonne
 *  arrivano con gli step della roadmap che le usano: per ora il nome, i link e
 *  il segno "completato". */
export interface Trekking {
  id: string
  nome: string
  link: string[]
  completato: boolean
  creato_il: string
  modificato_il: string
}

/** Quello che si scrive nel form: le colonne che l'app salva (docs/02-funzionalita.md). */
export interface CampiTrekking {
  nome: string
  link: string[]
}
