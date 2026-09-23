-- Trekking · 006 · Il dislivello del trekking
-- (docs/08-modello-dati.md, docs/06-roadmap.md step 9).
--
-- Metri di salita, intero positivo, facoltativo: chi non ce l'ha resta visibile.
--
-- Si applica a mano, dalla cartella di Grocery già collegata:
--   supabase db query --linked -f ../Trekking/supabase/sql/006_dislivello.sql
-- Rilanciabile.

alter table trekking.trekking
  add column if not exists dislivello integer;

alter table trekking.trekking
  drop constraint if exists trekking_dislivello_positivo;

alter table trekking.trekking
  add constraint trekking_dislivello_positivo check (dislivello is null or dislivello > 0);
