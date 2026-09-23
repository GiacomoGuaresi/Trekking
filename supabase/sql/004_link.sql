-- Trekking · 004 · I link del trekking
-- (docs/08-modello-dati.md, docs/06-roadmap.md step 7).
--
-- Gli indirizzi si salvano così come sono scritti (docs/02-funzionalita.md):
-- il database non li controlla, ci pensa l'app a scartare le righe vuote.
--
-- Si applica a mano, dalla cartella di Grocery già collegata:
--   supabase db query --linked -f ../Trekking/supabase/sql/004_link.sql
-- Rilanciabile.

alter table trekking.trekking
  add column if not exists link text[] not null default '{}';
