/** Le righe di `trekking.trekking` (docs/08-modello-dati.md). Le colonne
 *  arrivano con gli step della roadmap che le usano: per ora il nome e il
 *  segno "completato". */
export interface Trekking {
  id: string
  nome: string
  completato: boolean
  creato_il: string
  modificato_il: string
}
