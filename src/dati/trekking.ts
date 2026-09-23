// Le query sui trekking, tabella `trekking.trekking` (docs/08-modello-dati.md).
// Le colonne arrivano con gli step della roadmap: ricerca, ordinamento e filtri
// stanno nel browser, qui si leggono e si scrivono le righe.

import type { SupabaseClient } from '@supabase/supabase-js'
import type { CampiTrekking, Trekking } from '../dominio/tipi'
import { fallita } from './errore'

export class TrekkingSupabase {
  constructor(private readonly client: SupabaseClient) {}

  /** Tutti i trekking, dal più recente: ricerca, ordinamento e filtri li fa il browser. */
  async elenco(): Promise<Trekking[]> {
    const { data, error } = await this.client.from('trekking').select('*').order('creato_il', { ascending: false })
    if (error) throw fallita('Trekking non caricati', error)
    return data as Trekking[]
  }

  async crea(campi: CampiTrekking): Promise<Trekking> {
    const { data, error } = await this.client.from('trekking').insert(campi).select().single()
    if (error) throw fallita('Trekking non salvato', error)
    return data as Trekking
  }

  /** Salva i campi del form; `modificato_il` lo aggiorna il trigger. */
  async aggiorna(id: string, campi: CampiTrekking): Promise<Trekking> {
    const { data, error } = await this.client.from('trekking').update(campi).eq('id', id).select().single()
    if (error) throw fallita('Modifica non salvata', error)
    return data as Trekking
  }

  /** Segna o toglie il completato (docs/02-funzionalita.md): è reversibile. */
  async segnaCompletato(id: string, completato: boolean): Promise<Trekking> {
    const { data, error } = await this.client.from('trekking').update({ completato }).eq('id', id).select().single()
    if (error) throw fallita('Completato non cambiato', error)
    return data as Trekking
  }

  async elimina(id: string): Promise<void> {
    const { error } = await this.client.from('trekking').delete().eq('id', id)
    if (error) throw fallita('Trekking non eliminato', error)
  }
}
