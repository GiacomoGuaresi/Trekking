-- Trekking · 008 · Il luogo del trekking, per coordinate
-- (docs/08-modello-dati.md, docs/06-roadmap.md step 11).
--
-- Latitudine e longitudine, facoltative e sempre insieme: o ci sono tutte e due
-- o non c'è il luogo. Il nome del luogo arriva con lo step 12 (Photon).
--
-- Si applica a mano, dalla cartella di Grocery già collegata:
--   supabase db query --linked -f ../Trekking/supabase/sql/008_luogo.sql
-- Rilanciabile.

alter table trekking.trekking
  add column if not exists lat double precision,
  add column if not exists lon double precision;

alter table trekking.trekking
  drop constraint if exists trekking_lat_lon_insieme;

alter table trekking.trekking
  add constraint trekking_lat_lon_insieme
  check ((lat is null) = (lon is null));

alter table trekking.trekking
  drop constraint if exists trekking_lat_valida;

alter table trekking.trekking
  add constraint trekking_lat_valida
  check (lat is null or (lat >= -90 and lat <= 90));

alter table trekking.trekking
  drop constraint if exists trekking_lon_valida;

alter table trekking.trekking
  add constraint trekking_lon_valida
  check (lon is null or (lon >= -180 and lon <= 180));
