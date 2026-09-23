-- Trekking · 002 · La tabella dei trekking, con il solo nome
-- (docs/08-modello-dati.md, docs/06-roadmap.md step 3).
--
-- Le altre colonne (luogo, dislivello, durata, note…) arrivano con gli step che
-- le usano. Si applica a mano, dalla cartella di Grocery già collegata:
--   supabase db query --linked -f ../Trekking/supabase/sql/002_trekking.sql
-- Rilanciabile.

create table if not exists trekking.trekking (
  id             uuid primary key default gen_random_uuid(),
  nome           text not null check (btrim(nome) <> ''),
  creato_il      timestamptz not null default now(),
  modificato_il  timestamptz not null default now()
);

-- `modificato_il` lo tiene il database: l'app non lo scrive mai.
create or replace function trekking.segna_modifica()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.modificato_il = now();
  return new;
end;
$$;

drop trigger if exists segna_modifica on trekking.trekking;
create trigger segna_modifica
  before update on trekking.trekking
  for each row execute function trekking.segna_modifica();

-- Permessi ----------------------------------------------------------------------
-- Come nelle altre app: solo la sessione aperta con la passphrase, mai `anon`
-- (docs/04-sicurezza.md).

alter table trekking.trekking enable row level security;

revoke all on trekking.trekking from public, anon;
grant select, insert, update, delete on trekking.trekking to authenticated;

drop policy if exists trekking_authenticated on trekking.trekking;
create policy trekking_authenticated on trekking.trekking
  for all to authenticated
  using (true)
  with check (true);
