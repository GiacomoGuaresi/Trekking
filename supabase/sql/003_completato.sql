-- Trekking · 003 · Il segno "completato"
-- (docs/08-modello-dati.md, docs/06-roadmap.md step 5).
--
-- Si applica a mano, dalla cartella di Grocery già collegata:
--   supabase db query --linked -f ../Trekking/supabase/sql/003_completato.sql
-- Rilanciabile.

alter table trekking.trekking
  add column if not exists completato boolean not null default false;
