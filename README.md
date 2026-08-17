# MappaDellaFioritura

Breve descrizione del progetto: un sito statico che visualizza informazioni e contenuti relativi alla fioritura (mappe, foto e pagine descrittive). Il progetto è organizzato come una semplice web app statica pensata per essere aperta localmente o distribuita su un hosting statico.

Caratteristiche principali

- Sito statico basato su HTML/CSS/JavaScript.
- Visualizzazione di immagini e contenuti informativi nella cartella `images/`.
- Pagina principale `index.html` con l'interfaccia utente e interazioni definite in `script.js`.
- Pagina di profilo/descrizione `chi-sono.html` e una pagina di lavoro in corso `work-in-progress.html`.

Come eseguire in locale

1. Aprire `index.html` direttamente nel browser (doppio click) per uso base.
2. Oppure servire la cartella con un semplice server statico (consigliato per evitare restrizioni CORS):

```bash
python -m http.server 8000
# poi aprire http://localhost:8000
```

Struttura del progetto

- `index.html` — homepage e interfaccia principale.
- `chi-sono.html` — pagina di presentazione.
- `work-in-progress.html` — contenuti in sviluppo.
- `script.js` — logica JavaScript del sito.
- `style.css` — stili CSS.
- `images/` — immagini usate nel sito.

Contribuire

- Aprire una issue o proporre una pull request con miglioramenti, correzioni o nuove funzionalità.
- Aggiornare o aggiungere file nella cartella `images/` seguendo lo stile esistente.

Licenza
Da definire — aggiungere un file `LICENSE` se si desidera esplicitare i termini.

Contatti
Per maggiori informazioni, vedere i file del progetto o contattare il manutentore.
