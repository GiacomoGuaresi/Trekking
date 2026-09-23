// Le query sui trekking, tabella `trekking.trekking` (docs/08-modello-dati.md).
// Le colonne arrivano con gli step della roadmap: per ora c'è il solo nome.

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Trekking } from '../dominio/tipi'
import { fallita } from './errore'

export class TrekkingSupabase {
  constructor(private readonly client: SupabaseClient) {}

  /** Tutti i trekking, dal più recente: ricerca e ordinamento arrivano allo step 6. */
  async elenco(): Promise<Trekking[]> {
    const { data, error } = await this.client.from('trekking').select('*').order('creato_il', { ascending: false })
    if (error) throw fallita('Trekking non caricati', error)
    return data as Trekking[]
  }

  async crea(nome: string): Promise<Trekking> {
    const { data, error } = await this.client.from('trekking').insert({ nome }).select().single()
    if (error) throw fallita('Trekking non salvato', error)
    return data as Trekking
  }

  /** Cambia il nome; `modificato_il` lo aggiorna il trigger. */
  async rinomina(id: string, nome: string): Promise<Trekking> {
    const { data, error } = await this.client.from('trekking').update({ nome }).eq('id', id).select().single()
    if (error) throw fallita('Nome non cambiato', error)
    return data as Trekking
  }

  async elimina(id: string): Promise<void> {
    const { error } = await this.client.from('trekking').delete().eq('id', id)
    if (error) throw fallita('Trekking non eliminato', error)
  }
}
