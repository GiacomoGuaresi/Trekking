-- Trekking · 011 · Il tempo di viaggio in auto da casa
-- (docs/08-modello-dati.md, docs/06-roadmap.md step 14).
--
-- Minuti, facoltativi. `viaggio_manuale` dice che il tempo è stato scritto a
-- mano: dallo step 15 il ricalcolo automatico non lo tocca più.
--
-- Due regole stanno nel database, così valgono sempre:
--   - svuotando `viaggio_minuti`, `viaggio_manuale` torna `false`;
--   - se cambia il luogo e il tempo non è manuale, `viaggio_minuti` si svuota,
--     così verrà ricalcolato (serve dallo step 15).
--
-- Si applica a mano, dalla cartella di Grocery già collegata:
--   supabase db query --linked -f ../Trekking/supabase/sql/011_viaggio.sql
-- Rilanciabile.

alter table trekking.trekking
  add column if not exists viaggio_minuti integer,
  add column if not exists viaggio_manuale boolean not null default false;

alter table trekking.trekking
  drop constraint if exists trekking_viaggio_positivo;

alter table trekking.trekking
  add constraint trekking_viaggio_positivo
  check (viaggio_minuti is null or viaggio_minuti >= 0);

create or replace function trekking.sistema_viaggio()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Il luogo è cambiato e il tempo non è scritto a mano: si ricalcolerà.
  if tg_op = 'UPDATE'
     and new.viaggio_manuale is false
     and (new.lat is distinct from old.lat or new.lon is distinct from old.lon) then
    new.viaggio_minuti = null;
  end if;

  -- Senza tempo non c'è niente di manuale da proteggere.
  if new.viaggio_minuti is null then
    new.viaggio_manuale = false;
  end if;

  return new;
end;
$$;

drop trigger if exists sistema_viaggio on trekking.trekking;
create trigger sistema_viaggio
  before insert or update on trekking.trekking
  for each row execute function trekking.sistema_viaggio();
