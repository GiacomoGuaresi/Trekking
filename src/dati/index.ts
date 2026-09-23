// Punto d'ingresso dei dati: un solo client Supabase, sullo schema `trekking`
// del progetto di produzione di Grocery (docs/03-architettura.md).

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { AccessoSupabase, type Accesso } from './accesso'
import { ImpostazioniSupabase } from './impostazioni'
import { PhotonLuoghi, type RicercaLuoghi } from './luoghi'
import { TrekkingSupabase } from './trekking'

export type { Accesso, EsitoAccesso } from './accesso'
export type { ImpostazioniSupabase } from './impostazioni'
export type { RicercaLuoghi } from './luoghi'
export type { TrekkingSupabase } from './trekking'

let connessione: { accesso: Accesso; trekking: TrekkingSupabase; impostazioni: ImpostazioniSupabase } | null = null

/**
 * Il client è uno solo: accesso e query condividono la sessione.
 *
 * La sessione sta nei cookie con percorso `/`: Grocery e Projects stanno sulla
 * stessa origine e sullo stesso progetto Supabase, quindi con lo stesso percorso
 * le tre app condividono la sessione (docs/04-sicurezza.md).
 */
function connetti() {
  if (connessione) return connessione
  const url = import.meta.env.VITE_SUPABASE_URL
  const chiave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  const email = import.meta.env.VITE_SUPABASE_EMAIL
  if (!url || !chiave || !email) {
    throw new Error(
      'Mancano VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY o VITE_SUPABASE_EMAIL: vedi .env.example',
    )
  }
  const client = createBrowserClient(url, chiave, {
    cookieOptions: { path: '/' },
    db: { schema: 'trekking' },
  }) as unknown as SupabaseClient
  connessione = {
    accesso: new AccessoSupabase(client, email),
    trekking: new TrekkingSupabase(client),
    impostazioni: new ImpostazioniSupabase(client),
  }
  return connessione
}

/** Chi può entrare: serve la sessione aperta dalla passphrase. */
export function accesso(): Accesso {
  return connetti().accesso
}

/** Le query sui trekking. */
export function trekking(): TrekkingSupabase {
  return connetti().trekking
}

/** Le impostazioni: per ora la sola posizione di casa. */
export function impostazioni(): ImpostazioniSupabase {
  return connetti().impostazioni
}

const ricercaLuoghi = new PhotonLuoghi()

/** La ricerca dei luoghi per nome: Photon, senza chiave e senza sessione. */
export function luoghi(): RicercaLuoghi {
  return ricercaLuoghi
}
