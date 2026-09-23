-- Trekking · 007 · La durata del trekking
-- (docs/08-modello-dati.md, docs/06-roadmap.md step 10).
--
-- Ore di andata e ritorno, a passi di mezz'ora (3.5 = 3 ore e 30 minuti),
-- facoltativa: chi non ce l'ha resta visibile.
--
-- Si applica a mano, dalla cartella di Grocery già collegata:
--   supabase db query --linked -f ../Trekking/supabase/sql/007_durata.sql
-- Rilanciabile.

alter table trekking.trekking
  add column if not exists durata_ore numeric(3, 1);

alter table trekking.trekking
  drop constraint if exists trekking_durata_mezzore;

alter table trekking.trekking
  add constraint trekking_durata_mezzore
  check (durata_ore is null or (durata_ore > 0 and (durata_ore * 2) = floor(durata_ore * 2)));
