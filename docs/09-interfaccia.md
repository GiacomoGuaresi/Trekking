# 09 · Interfaccia

## Coerenza con le altre app

Stessa struttura di Grocery e Projects, con un colore diverso:
- **intestazione piena** nel colore dell'app, con ☰ a sinistra e **+** (inserimento rapido) a destra;
- **menu laterale** a scomparsa, sempre aperto su schermi larghi: **Elenco**, **Mappa**, **Installa l'app**;
- stesso font e stesse icone Lucide;
- solo **italiano** e solo **tema chiaro**.

## Palette · blu montagna

| Uso | Colore | Note |
|---|---|---|
| Intestazione, pulsanti principali, `theme_color` della PWA | `#3f6485` | blu montagna |
| Accento, puntini sulla mappa | `#5b87ad` | blu più chiaro |
| Sfondo, `background_color` della PWA | `#f1f5f9` | azzurro ghiaccio molto chiaro |
| Testo e icone sull'intestazione | `#fbf8f1` | panna, come nelle altre app |

Valori di partenza, da rifinire allo step "Aspetto" della [roadmap](06-roadmap.md).

## Icona

Stesso sistema delle altre app: disegno Lucide **`mountain-snow`** (montagna con la cima innevata) panna su blu montagna `#3f6485`, in `public/icona.svg`, da cui `npm run icone` genera le icone della PWA.

## Sfondo

**Sfondo doodle a tema montagna** (cime, abeti, scarponi, bussola, zaino, sentiero tratteggiato), generato da `scripts/genera-sfondo.ts` con un seed fisso, come nelle altre app.

## Schermate

| Schermata | Contenuto |
|---|---|
| **Elenco** (`#/`) | ricerca, filtri, tabella semplice ordinabile per colonna ([02](02-funzionalita.md#elenco)) |
| **Mappa** (`#/mappa`) | stessa ricerca e stessi filtri, puntini, casa, popup con i dettagli |
| **Inserimento / modifica** | modale con il form ([02](02-funzionalita.md#inserimento-rapido)) |
| **Accesso** | solo passphrase, come le altre app |
| **Popup dei percorsi mancanti** | all'apertura, se ci sono tempi di viaggio da calcolare |
