/** Le righe di `trekking.trekking` (docs/08-modello-dati.md). Le colonne
 *  arrivano con gli step della roadmap che le usano: per ora c'è il nome. */
export interface Trekking {
  id: string
  nome: string
  creato_il: string
  modificato_il: string
}
