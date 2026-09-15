# Trekking

Piccolo database dei trekking da fare: si salvano al volo, con i dettagli disponibili, quando se ne trova uno interessante sui social, su un sito o su Komoot, e si sceglie dove andare dall'elenco o dalla mappa. Terza app di casa dopo **Grocery** e **Projects**. Si usa da smartphone e da PC.

> **Stato: sviluppo, Fase 1** (vedi [roadmap](docs/06-roadmap.md)). Online su [giacomoguaresi.github.io/Trekking](https://giacomoguaresi.github.io/Trekking/).

## Cosa fa

- **Inserimento rapido**: nome (unico obbligatorio), luogo, link, dislivello, durata, tempo di viaggio, note; avviso se il nome esiste già
- **Luogo** per nome, con i suggerimenti di Photon, oppure per coordinate
- **Tempo di viaggio in auto da casa** calcolato con openrouteservice, o scritto a mano; **distanza in linea d'aria** da casa
- **Elenco** con ricerca per nome e filtri su dislivello, durata, distanza e tempo di viaggio; i completati si nascondono
- **Mappa** con un puntino per trekking e i dettagli in un popup

## In breve

- **Frontend**: Vite + React + TypeScript + Tailwind, sito statico installabile come PWA
- **Dati e accesso**: [Supabase](https://supabase.com) (Postgres + Auth), sullo stesso progetto e con lo stesso account di Grocery e Projects
- **Mappe**: Leaflet con OpenStreetMap e OpenTopoMap, Photon, openrouteservice
- **Hosting**: GitHub Pages → `giacomoguaresi.github.io/Trekking/`
- **Lingua**: italiano · **Costo**: 0 € · **Licenza**: MIT

## Documentazione

| Documento | Contenuto |
|---|---|
| [docs/01-visione.md](docs/01-visione.md) | Scopo, origine, utenti, principi, cosa non è |
| [docs/02-funzionalita.md](docs/02-funzionalita.md) | Funzionalità previste |
| [docs/03-architettura.md](docs/03-architettura.md) | Stack, servizi esterni, convivenza con Grocery e Projects, struttura cartelle |
| [docs/04-sicurezza.md](docs/04-sicurezza.md) | Passphrase, posizione di casa, permessi, chiavi |
| [docs/05-deploy.md](docs/05-deploy.md) | Pubblicazione, configurazione e servizi esterni |
| [docs/06-roadmap.md](docs/06-roadmap.md) | Fasi di sviluppo |
| [docs/07-decisioni.md](docs/07-decisioni.md) | Registro delle decisioni |
| [docs/08-modello-dati.md](docs/08-modello-dati.md) | Tabelle e regole nel database |
| [docs/09-interfaccia.md](docs/09-interfaccia.md) | Struttura, palette, icona, schermate |
| [Q&A.md](Q&A.md) | Domande ancora aperte |
