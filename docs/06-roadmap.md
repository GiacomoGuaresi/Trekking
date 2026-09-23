# 06 · Roadmap

## Come si procede

Sviluppo a **piccoli incrementi stabili**. Ogni step:

- aggiunge **una sola cosa** utilizzabile, dal database all'interfaccia;
- se tocca il database, porta il suo script `supabase/sql/NNN_*.sql`: le colonne arrivano quando servono, non tutte all'inizio;
- è **finito** quando:
  1. i test sono verdi e la build riesce;
  2. c'è un commit su `main` e il deploy online è riuscito;
  3. l'app online si può usare davvero, senza pezzi a metà.

Le **prove a mano da telefono e da PC** non fermano più uno step: si raccolgono tutte
nello step [22](#fase-4--rifinitura), da fare in un giro solo alla fine.

Si passa allo step successivo solo quando il precedente è finito. L'ordine porta prima possibile a un'app che **sostituisce il file di note**, poi aggiunge filtri, luoghi e mappa.

Accanto a uno step è indicata la domanda del [Q&A](../Q&A.md) da chiudere prima di iniziarlo, se ce n'è una.

## Fase 0 · Progettazione ✅
- [x] Documentazione di base, scopo e funzionalità
- [x] Giri di Q&A 1–7
- [x] Scelta dei servizi: Photon, openrouteservice, Leaflet con OpenStreetMap e OpenTopoMap
- [x] Prima stesura del modello dati ([08](08-modello-dati.md)) e dell'interfaccia ([09](09-interfaccia.md))
- [x] Documentazione senza punti aperti

## Fase 1 · Un'app online che sostituisce il file di note ← *in corso*

- [x] **1 · Scheletro pubblicato**: `git init`, LICENSE, repository pubblico, scaffold Vite + React + TS + Tailwind + Vitest, workflow `pubblica.yml`, una pagina vuota "Trekking" online su GitHub Pages
- [x] **2 · Accesso**: schermata della passphrase, sessione condivisa con Grocery e Projects, schema `trekking` vuoto ed esposto nell'API. *Finito anche quando*: da Grocery si entra senza passphrase
  - [x] Schermata della passphrase e cancello davanti all'app (`src/ui/Accesso.tsx`, `src/ui/ConAccesso.tsx`)
  - [x] Client Supabase sullo schema `trekking`, sessione nei cookie con percorso `/` come Grocery e Projects (`src/dati/`)
  - [x] Test della logica d'accesso (`src/dati/accesso.test.ts`)
  - [x] Script `supabase/sql/001_schema.sql` e variabili di Supabase nel workflow `pubblica.yml`
  - [x] `001_schema.sql` applicato in produzione il 2026-09-16 (`supabase db query --linked` dalla cartella di Grocery): schema `trekking` con gli stessi permessi di `projects`
  - [x] `trekking` esposto nell'API il 2026-09-16 con la Management API ([05](05-deploy.md)): l'API risponde sullo schema, `public` e `projects` invariati
  - [x] `https://giacomoguaresi.github.io/Trekking/` negli URL di redirect di Auth (2026-09-16); registrazioni pubbliche ancora spente
  - [x] Variabili `VITE_SUPABASE_*` nel repository GitHub, GitHub Pages attivo, deploy riuscito il 2026-09-16
  - [x] Provato da telefono e da PC il 2026-09-23: entrati in Grocery, Trekking si apre senza passphrase
- [x] **3 · Salvare un trekking**: tabella `trekking` con il solo nome, RLS, pulsante **+** con form di un campo, tabella semplice con i nomi, guscio con intestazione blu e menu. *Finito anche quando*: senza sessione una query non restituisce righe
  - [x] `002_trekking.sql` applicato in produzione il 2026-09-23: tabella con `nome`, `creato_il`, `modificato_il` da trigger, RLS e grant solo per `authenticated`
  - [x] Verifica: senza sessione la query è respinta ("permission denied for schema trekking"), con la sessione risponde
  - [x] Guscio con intestazione blu, menu laterale, rotta `#/` (`src/ui/App.tsx`, `MenuLaterale.tsx`, `rotta.ts`)
  - [x] Pulsante **+** con il modale di un campo ed elenco dei nomi (`ModaleNome.tsx`, `Elenco.tsx`)
  - [x] Test del nome ripulito e validato (`src/dominio/nome.test.ts`)
- [x] **4 · Modificare ed eliminare**: modifica del nome, eliminazione con conferma
  - [x] `rinomina` ed `elimina` sulla tabella (`src/dati/trekking.ts`)
  - [x] Matita e cestino in fondo a ogni riga dell'elenco (`src/ui/Elenco.tsx`)
  - [x] "Cambia nome" riusa il modale del nome; eliminazione dietro una conferma (`ModaleNome.tsx`, `Conferma.tsx`)
  - [x] Test dell'elenco aggiornato senza rileggere il database (`src/dominio/elenco.test.ts`)
- [ ] **5 · Completato**: segno reversibile, completati nascosti, interruttore "Mostra completati"
- [ ] **6 · Ricerca, ordinamento e doppioni**: ricerca per nome, ordinamento cliccando sulle colonne, avviso mentre si scrive un nome già presente
- [ ] **7 · Link**: uno o più link per trekking, apribili dall'elenco
- [ ] **8 · Note**: campo Markdown con la formattazione di base

➜ **Da qui l'app può già sostituire il file di note.**

## Fase 2 · Scegliere un trekking

- [ ] **9 · Dislivello**: campo nel form, filtro min/max (i trekking senza dislivello restano visibili)
- [ ] **10 · Durata**: campo a passi di mezz'ora, filtro min/max
- [ ] **11 · Luogo per coordinate**: interruttore Nome / Coordinate con la sola parte Coordinate, `lat` e `lon` nel database
- [ ] **12 · Luogo per nome**: suggerimenti di Photon, conversione in coordinate, primo risultato se non se ne sceglie uno
- [ ] **13 · Casa e distanza**: tabella `impostazioni` con le coordinate di casa inserite a mano, distanza in linea d'aria nell'elenco, filtro "distanza massima"
- [ ] **14 · Tempo di viaggio a mano**: campo, filtro "tempo massimo"
- [ ] **15 · Tempo di viaggio automatico**: chiave openrouteservice, calcolo al salvataggio e al cambio del luogo (fino alla strada più vicina), valore manuale non sovrascritto; ordinamento di default per tempo di viaggio
- [ ] **16 · Tempi mancanti**: recupero dei mancanti a ogni salvataggio, popup "Ricalcola percorsi mancanti" all'apertura, luogo tolto quando il percorso è impossibile

## Fase 3 · Mappa

- [ ] **17 · Mappa essenziale**: pagina Mappa nel menu, Leaflet con OpenStreetMap, un puntino per trekking con coordinate, popup con i dettagli
- [ ] **18 · Mappa con i filtri**: stessa ricerca e stessi filtri dell'elenco, condivisi tra le due pagine
- [ ] **19 · Casa e OpenTopoMap**: icona di casa, scelta della mappa topografica

## Fase 4 · Rifinitura

- [ ] **20 · Installabile**: icona, PWA, voce "Installa l'app" come nelle altre app
- [ ] **21 · Aspetto**: palette blu montagna rifinita, sfondo doodle a tema montagna, animazioni brevi ([09](09-interfaccia.md))
- [ ] **22 · Prove da telefono e da PC**: un giro solo sull'app online, con il telefono e con il PC
  - [ ] Si entra senza passphrase venendo da Grocery o da Projects
  - [ ] Salvare un trekking e rivederlo nell'elenco dopo aver ricaricato
  - [ ] Cambiare il nome di un trekking ed eliminarne uno
  - [ ] Segnare e togliere il completato, con l'interruttore "Mostra completati"
  - [ ] Ricerca, ordinamento, avviso dei doppioni, link e note
  - [ ] Filtri di dislivello, durata, distanza e tempo di viaggio
  - [ ] Mappa: puntini, popup, filtri condivisi con l'elenco
- [ ] **23 · Chiusura**: checklist di sicurezza completa ([04](04-sicurezza.md)), README con screenshot

## Più avanti, se servirà
- [ ] Posizione GPS: distanza dalla posizione attuale e puntino sulla mappa
- [ ] Google Places al posto di Photon
- [ ] Importazione delle voci dal vecchio file di note
