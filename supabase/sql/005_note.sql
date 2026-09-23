-- Trekking · 005 · Le note del trekking
-- (docs/08-modello-dati.md, docs/06-roadmap.md step 8).
--
-- Testo libero in Markdown, facoltativo: vuoto vuol dire `null`.
--
-- Si applica a mano, dalla cartella di Grocery già collegata:
--   supabase db query --linked -f ../Trekking/supabase/sql/005_note.sql
-- Rilanciabile.

alter table trekking.trekking
  add column if not exists note text;
