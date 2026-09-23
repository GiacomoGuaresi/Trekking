-- Trekking · 009 · Il nome del luogo
-- (docs/08-modello-dati.md, docs/06-roadmap.md step 12).
--
-- Facoltativo: resta vuoto quando il luogo è stato inserito come coordinate.
--
-- Si applica a mano, dalla cartella di Grocery già collegata:
--   supabase db query --linked -f ../Trekking/supabase/sql/009_luogo_nome.sql
-- Rilanciabile.

alter table trekking.trekking
  add column if not exists luogo_nome text;
