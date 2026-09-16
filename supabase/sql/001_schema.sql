-- Trekking · 001 · Schema vuoto (docs/03-architettura.md, docs/04-sicurezza.md).
--
-- Gira sul progetto Supabase di produzione di Grocery, in uno schema dedicato:
-- nessuna tabella di Grocery (public) o di Projects (projects) viene toccata.
-- Si applica a mano dal SQL Editor della dashboard, non con `supabase db push`,
-- che andrebbe in conflitto con lo storico migrazioni di Grocery.
--
-- Dopo averlo eseguito: Settings → Data API → aggiungere `trekking` agli
-- Exposed schemas (docs/05-deploy.md).
--
-- Le tabelle arrivano con gli step che le usano, ognuna con RLS e grant suoi.
-- Rilanciabile.

create schema if not exists trekking;

-- Permessi ----------------------------------------------------------------------
-- Solo la sessione aperta con la passphrase (ruolo authenticated) usa lo schema.

revoke all on schema trekking from public, anon;
grant usage on schema trekking to authenticated;
