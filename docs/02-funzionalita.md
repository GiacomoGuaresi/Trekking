# 02 · Funzionalità

## Il caso d'uso principale

1. Trovo un trekking interessante sui social, su un sito o su Komoot.
2. Apro l'app e il **form di inserimento rapido**.
3. Inserisco i dettagli che ho in quel momento (spesso solo il nome) e salvo.

Poi, quando si decide dove andare, si apre l'**elenco** o la **mappa** e si filtra.

## Inserimento rapido

Un solo form, pensato per il telefono. Solo il nome è obbligatorio.

| Campo | Obbligatorio | Formato |
|---|---|---|
| **Nome** | sì | testo libero |
| **Luogo** | no | nome del luogo **oppure** coordinate, vedi [Luogo](#luogo) |
| **Link** | no | uno o più indirizzi (post, articolo, Komoot…), salvati così come sono |
| **Dislivello** | no | metri, intero positivo |
| **Durata** | no | ore di andata e ritorno, a passi di mezz'ora (`3.5` = 3 ore e 30 minuti) |
| **Tempo di viaggio** | no | calcolato in automatico da casa; si può anche scrivere a mano, vedi [Tempo di viaggio](#tempo-di-viaggio-e-distanza-da-casa) |
| **Note** | no | Markdown con la formattazione di base: grassetto, corsivo, elenchi, link |

- **Doppioni**: mentre si scrive il nome, se esiste già un trekking con un nome simile (senza distinguere maiuscole, minuscole e accenti) compare un avviso con il nome trovato. L'avviso non blocca il salvataggio.
- **Komoot e altri siti**: i dati non si leggono dal link. Dislivello e durata si scrivono a mano.

## Luogo

Un interruttore **Nome / Coordinate** sceglie come si indica il luogo:

- **Nome**: si scrive il nome del luogo, l'app propone i luoghi trovati da **Photon** e lo converte in coordinate. Si salvano nome e coordinate. Se si salva **senza scegliere un suggerimento**, l'app usa **il primo risultato** di Photon: un luogo impreciso è accettabile, e si corregge in modifica. Se Photon non trova nulla, si salva solo il nome del luogo, senza coordinate.
- **Coordinate**: si incollano latitudine e longitudine, come si copiano da Google Maps (`45.9876, 9.8765`). Si salvano solo le coordinate; il nome del luogo resta vuoto.

Regole:
- il luogo è **indipendente dal nome del trekking**: nessun suggerimento automatico a partire dal nome;
- un trekking ha **un solo luogo**: mete diverse sono trekking diversi;
- la ricerca dei luoghi sta dietro un'interfaccia propria, per poter passare a Google Places in futuro senza toccare il resto dell'app.

## Tempo di viaggio e distanza da casa

La posizione di **casa** è un punto fisso salvato nel database ([04](04-sicurezza.md)). Non si modifica dall'app.

| Dato | Come si ottiene | Quando | Salvato |
|---|---|---|---|
| **Distanza in linea d'aria** | calcolata nel browser dalle coordinate di casa e del luogo | ogni volta che si apre l'elenco o la mappa | no |
| **Tempo di viaggio in auto** | chiesto a **openrouteservice**, con partenza da casa | al salvataggio e quando cambia il luogo | sì |

- Il tempo di viaggio si può **scrivere a mano**: da quel momento il calcolo non lo sovrascrive più. Svuotando il campo torna automatico.
- Se openrouteservice non risponde, il trekking si salva lo stesso senza tempo di viaggio.
- I **tempi mancanti** (trekking con coordinate, senza tempo e non manuali) si recuperano in due modi:
  - a ogni **inserimento o modifica** di un trekking, l'app prova a calcolare anche quelli mancanti;
  - all'**apertura dell'app**, se ce ne sono, compare un popup con il numero dei trekking da calcolare e il pulsante **Ricalcola percorsi mancanti**.
- Quando il luogo è lontano dalle strade (cime, laghi, rifugi), il tempo è calcolato fino alla **strada più vicina**.
- Il popup compare a ogni apertura in cui ci sono tempi mancanti; con la regola qui sotto succede solo dopo che openrouteservice era irraggiungibile.
- **Percorso non calcolabile**: se openrouteservice risponde che il percorso **non esiste** (luogo irraggiungibile in auto, troppo lontano, punto sbagliato), l'app **toglie il luogo** dal trekking (nome del luogo e coordinate) e lo segnala con un breve messaggio. Il trekking resta nell'elenco, non compare più sulla mappa e non viene più ricalcolato; il luogo si può reinserire in modifica. Se invece il servizio è **irraggiungibile** (rete assente, server fuori servizio, quota esaurita), il luogo resta e il tempo si riprova più tardi.
- Senza luogo, distanza e tempo di viaggio restano vuoti.
- La **durata** del trekking non si può calcolare: si scrive solo a mano.

## Elenco

- **Tabella semplice**, sia su PC sia su telefono (su telefono scorre in orizzontale). Le card su telefono si valuteranno dopo l'uso.
- **Ordinamento**: di default per **tempo di viaggio crescente**, i più vicini in cima. Toccando l'intestazione di una colonna si ordina per quella colonna; un secondo tocco inverte l'ordine. I trekking senza il valore vanno sempre in fondo.
- **Ricerca per nome**.
- **Filtri**:
  - dislivello minimo / massimo;
  - durata minima / massima;
  - distanza massima da casa, in linea d'aria;
  - tempo di viaggio massimo da casa.
- Un trekking a cui **manca il dato** su cui si filtra (niente luogo, niente tempo di viaggio, niente dislivello…) **resta visibile**: i filtri nascondono solo i trekking con un valore fuori dall'intervallo.
- **Completato**: si segna e si toglie con un tocco. I completati spariscono dall'elenco; l'interruttore **Mostra completati** li fa ricomparire.
- **Modifica** di tutti i campi ed **eliminazione** con conferma.
- Niente raggruppamenti per zona, tipo o tag.

## Mappa

- **Pagina a sé**, con la **stessa ricerca e gli stessi filtri** dell'elenco.
- Mappa base **OpenStreetMap**, con **OpenTopoMap** (curve di livello e sentieri) come alternativa selezionabile.
- Un **puntino** per ogni trekking con le coordinate. Quelli senza luogo non compaiono sulla mappa, ma restano nell'elenco.
- Toccando un puntino si apre un **popup con i dettagli**: nome, dislivello, durata, tempo di viaggio, distanza, link, note, con il pulsante per modificare.
- **Casa** è segnata con un'icona propria.
