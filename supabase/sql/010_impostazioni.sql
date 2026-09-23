-- Trekking · 010 · Le impostazioni, con la posizione di casa
-- (docs/08-modello-dati.md, docs/06-roadmap.md step 13).
--
-- Una riga sola: `id` è sempre `true`, così una seconda riga non ci sta.
-- Lo script crea la tabella **vuota**: le coordinate di casa si inseriscono a
-- mano dal SQL Editor e non vanno mai in un file del repository
-- (docs/04-sicurezza.md).
--
-- Si applica a mano, dalla cartella di Grocery già collegata:
--   supabase db query --linked -f ../Trekking/supabase/sql/010_impostazioni.sql
-- Rilanciabile.

create table if not exists trekking.impostazioni (
  id        boolean primary key default true check (id),
  casa_lat  double precision check (casa_lat is null or (casa_lat >= -90 and casa_lat <= 90)),
  casa_lon  double precision check (casa_lon is null or (casa_lon >= -180 and casa_lon <= 180)),
  constraint impostazioni_casa_insieme check ((casa_lat is null) = (casa_lon is null))
);

-- Permessi ----------------------------------------------------------------------
-- Come le altre tabelle: solo la sessione aperta con la passphrase, mai `anon`
-- (docs/04-sicurezza.md). L'app legge e basta: la posizione di casa si cambia
-- dal SQL Editor.

alter table trekking.impostazioni enable row level security;

revoke all on trekking.impostazioni from public, anon;
grant select on trekking.impostazioni to authenticated;

drop policy if exists impostazioni_authenticated on trekking.impostazioni;
create policy impostazioni_authenticated on trekking.impostazioni
  for select to authenticated
  using (true);
