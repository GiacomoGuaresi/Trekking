# 04 · Sicurezza

## Contesto

Il repository e il sito sono **pubblici**. I dati devono essere visibili solo a chi ha fatto accesso. Progetto Supabase, account e modo di accesso sono **gli stessi di Grocery e Projects**.

## Chiavi e variabili

| Variabile | Dove sta | Pubblica? |
|---|---|---|
| `VITE_SUPABASE_URL` | `.env.local` in locale, *Variables* del repo GitHub in CI | sì, finisce nel bundle |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | stessa gestione | sì, per design: da sola non concede nulla con RLS attiva |
| `VITE_SUPABASE_EMAIL` | stessa gestione | sì: senza passphrase non basta |
| `VITE_OPENROUTESERVICE_KEY` | stessa gestione | sì, finisce nel bundle. Il piano è gratuito: chi la copiasse potrebbe al massimo esaurire la quota del giorno, e i tempi mancanti si ricalcolerebbero il giorno dopo. Se succede, si rigenera |
| Secret / service role key | **mai nel repo, né nel frontend, né nelle variabili di Actions** | no |
| Password del database | solo in locale, per applicare gli script SQL | no |

Photon, OpenStreetMap e OpenTopoMap non richiedono chiavi.

## Posizione di casa

Un'app statica **non ha segreti**: ogni variabile `VITE_*`, anche se sta nei *Secrets* di GitHub, finisce nel JavaScript pubblicato, leggibile da chiunque apra il sito senza passphrase. Per questo le coordinate di casa **non stanno nella build**.

- Stanno nella tabella `trekking.impostazioni` ([08](08-modello-dati.md)), protetta da RLS come il resto: si leggono solo dopo l'accesso.
- Si inseriscono **una volta, a mano, dal SQL Editor**. Lo script `supabase/sql/` crea solo la tabella: i valori **non vanno mai in un file del repository**.
- I servizi esterni vedono le coordinate di casa solo nelle richieste a openrouteservice per il tempo di viaggio.

## Autenticazione

- Un solo utente Supabase Auth, condiviso con le altre app.
- L'email è fissata nella build; chi entra scrive solo la **passphrase** (`signInWithPassword`).
- Niente pulsante "Esci", come le altre app.
- **Sessione condivisa**: stessa origine (`giacomoguaresi.github.io`), stesso progetto Supabase e cookie con percorso `/`, quindi chi è dentro Grocery o Projects è dentro anche in Trekking.

## Autorizzazione (RLS)

- RLS attiva su ogni tabella dello schema `trekking`.
- Policy: `for all to authenticated using (true) with check (true)`; su `impostazioni` basta la sola lettura.
- `revoke all … from anon`; `grant usage on schema trekking to authenticated` e grant sugli oggetti dello schema.
- Viste con `security_invoker = true`; funzioni `security invoker` con `search_path = ''`.

⚠️ Con un progetto condiviso, **qualunque utente autenticato vede tutte le app**. Oggi l'utente è uno solo, quindi va bene.

## Checklist prima di pubblicare

- [x] Registrazioni pubbliche spente sul progetto (`disable_signup: true`, verificato il 2026-09-16)
- [ ] RLS attiva su ogni tabella dello schema `trekking`
- [ ] Una query con la sola publishable key e senza sessione non restituisce righe, nemmeno da `impostazioni`
- [ ] Nessun file `.env*` committato (solo `.env.example`)
- [ ] Coordinate di casa assenti dal repo, dalla storia git e dal `dist/` pubblicato
- [ ] Secret key e password del DB assenti dal repo e dalla storia git
- [x] URL di redirect di Auth: aggiunto `https://giacomoguaresi.github.io/Trekking/`
- [ ] Sessione condivisa verificata: accesso a Grocery → Trekking aperto senza passphrase
