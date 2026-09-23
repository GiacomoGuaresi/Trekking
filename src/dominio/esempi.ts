// Trekking d'esempio per i test: si scrivono solo i campi che contano alla prova.

import type { Trekking } from './tipi'

let prossimo = 1

export function esempio(campi: Partial<Trekking> = {}): Trekking {
  const id = String(prossimo++)
  return {
    id,
    nome: `Trekking ${id}`,
    link: [],
    completato: false,
    creato_il: '2026-09-23T10:00:00Z',
    modificato_il: '2026-09-23T10:00:00Z',
    ...campi,
  }
}
