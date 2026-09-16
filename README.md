# Mappa della Fioritura

Sito statico bilingue dedicato alla **Mappa della Fioritura**, uno strumento di consapevolezza basato sulla data di nascita e sulla Matrice del Destino. Il sito presenta il progetto di Silvia, descrive i percorsi disponibili e permette di calcolare una mappa personale direttamente nel browser.

## Funzionalita

### Calcolo della mappa

La homepage consente di:

- scegliere il profilo **Adulto** o **Bambino**;
- inserire nome e data di nascita;
- calcolare e visualizzare la Matrice del Destino in una grafica interattiva;
- mostrare il centro della mappa con la relativa descrizione;
- visualizzare eta, compleanno e approfondimenti della mappa;
- compilare la **Tessera Sanitaria** con valori fisici, energetici ed emozionali associati ai chakra;
- visualizzare scopo personale, scopo sociale, scopo generale, relazioni, talenti e prognosi;
- esportare la mappa come immagine PNG o condividerla tramite le funzioni disponibili nel browser.

Il calcolo e l'elaborazione dei dati avvengono lato client. Il progetto non include un backend, un database o un sistema di account.

### Pagine informative

- **Mappa**: calcolo della Matrice del Destino e risultati personalizzati.
- **Chi sono**: storia di Silvia, rapporto tra numeri e Reiki e presentazione del percorso integrato.
- **Servizi**: catalogo dei percorsi per bambini e famiglie, adulti, casa e ambiente, Reiki e percorsi integrati, con formati e prezzi disponibili.
- **Work in Progress**: pagina statica di cortesia per eventuali fasi di aggiornamento.

### Italiano e inglese

Ogni pagina principale e disponibile in italiano e in inglese:

- versione italiana nella cartella principale;
- versione inglese nella cartella `en/`;
- selettore IT/EN nella navigazione;
- preferenza della lingua salvata in `localStorage` con chiave `mappaFioritura:lingua`;
- reindirizzamento automatico alla versione inglese per browser in inglese, se non e stata gia scelta una lingua.

## Tecnologie

- HTML5 semantico;
- CSS3, con fogli di stile separati per base, homepage, pagina personale e servizi;
- JavaScript moderno senza framework;
- SVG per la visualizzazione della matrice;
- Canvas API per la generazione dell'immagine PNG;
- Google Fonts: Cormorant Garamond e Manrope;
- immagini locali in formato WebP e PNG.

Non sono presenti `package.json`, tool di build o dipendenze npm da installare.

## Avvio in locale

E sufficiente servire la cartella del progetto con un server statico. Dalla directory principale:

```bash
python -m http.server 8000
```

Aprire quindi [http://localhost:8000](http://localhost:8000) nel browser.

Un server locale e consigliato rispetto all'apertura diretta dei file HTML, soprattutto per verificare correttamente il cambio pagina, il precaricamento delle pagine, le risorse locali e l'esportazione PNG.

## Struttura del progetto

```text
.
├── index.html                 # Homepage italiana e calcolo della mappa
├── chi-sono.html              # Presentazione di Silvia e del progetto
├── servizi.html               # Catalogo dei servizi in italiano
├── work-in-progress.html      # Pagina statica di cortesia
├── script.js                  # Calcoli, interazioni, animazioni, export e lingua
├── en/
│   ├── index.html             # Homepage inglese
│   ├── chi-sono.html          # Pagina About in inglese
│   └── servizi.html           # Pagina Services in inglese
├── styles/
│   ├── style.css              # Variabili, reset, navigazione e componenti condivisi
│   ├── index.css              # Homepage e matrice
│   ├── chi-sono.css            # Pagina Chi sono
│   └── servizi.css             # Pagina Servizi
├── images/
│   ├── ITAmatrice.webp         # Sfondo della matrice italiana
│   ├── ENGmatrice.webp         # Sfondo della matrice inglese
│   ├── logo.webp               # Logo del progetto
│   ├── silvia.webp             # Foto della pagina Chi sono
│   ├── elemento.webp           # Risorsa grafica
│   └── social-preview.png      # Anteprima per social e metadati Open Graph
├── debug-matrice.html          # Strumento per correggere coordinate e punti SVG
├── sitemap.xml                 # Sitemap del sito pubblico
├── robots.txt                  # Direttive per i crawler
├── CNAME                       # Dominio personalizzato del deploy
└── _headers                    # Header per hosting statici compatibili
```

## Strumento di debug

Aprire `/debug-matrice.html` con il server locale per modificare le coordinate dei punti della matrice. Lo strumento permette di selezionare e trascinare i punti, modificare i valori X/Y, ripristinare i valori iniziali e copiare il JSON aggiornato.

Le coordinate definitive sono mantenute in `script.js`, nell'oggetto `CERCHI`.

## Deploy

Il progetto non richiede una fase di compilazione: e sufficiente pubblicare i file così come sono su un hosting statico. Il file `CNAME` identifica il dominio personalizzato `mappadellafioritura.it`; `sitemap.xml`, `robots.txt` e i metadati presenti nelle pagine sono gia predisposti per la pubblicazione.

Prima del deploy verificare:

1. che tutte le risorse siano raggiungibili con i percorsi relativi;
2. che le pagine italiano/inglese abbiano i relativi collegamenti `hreflang`;
3. che il calcolo funzioni sia sulla homepage italiana sia su quella inglese;
4. che l'export PNG funzioni nel browser di destinazione;
5. che il dominio e gli header siano configurati secondo il provider di hosting utilizzato.

## Contatti

- Email: [silvia@mappadellafioritura.it](mailto:silvia@mappadellafioritura.it)
- Instagram: [@silvia.mappadellafioritura](https://www.instagram.com/silvia.mappadellafioritura/)
- Facebook: [Mappa della Fioritura](https://www.facebook.com/share/1BoEdAN7Y4/?mibextid=wwXIfr)

## Licenza

Il progetto non dichiara ancora una licenza software. Prima di riutilizzare o distribuire il codice, definire i termini di licenza e i diritti relativi a testi, fotografie, logo e immagini della matrice.