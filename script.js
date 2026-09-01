/* =========================================================
   MATRICE DEL DESTINO - script.js
   ========================================================= */

// Coordinate dei cerchi visibili nell'immagine (viewBox 1000x1000).
// Se necessario puoi rifinire qualche coordinata di pochi pixel.
const CERCHI = {
  eta0: { x: 138, y: 502, fontSize: 40 },
  eta10: { x: 244, y: 244, fontSize: 40 },
  eta20: { x: 502, y: 138, fontSize: 40 },
  eta30: { x: 759, y: 244, fontSize: 40 },
  eta40: { x: 865, y: 502, fontSize: 40 },
  eta50: { x: 759, y: 759, fontSize: 40 },
  eta60: { x: 502, y: 865, fontSize: 40 },
  eta70: { x: 244, y: 759, fontSize: 40 },
  centro: { x: 502, y: 502, fontSize: 50 },
  top1: { x: 502, y: 210, fontSize: 30 },
  top2: { x: 502, y: 262, fontSize: 20 },
  top3: { x: 502, y: 361, fontSize: 20 },
  left1: { x: 211, y: 502, fontSize: 30 },
  left2: { x: 261, y: 502, fontSize: 20 },
  left3: { x: 361, y: 502, fontSize: 20 },
  right1: { x: 740, y: 502, fontSize: 20 },
  right2: { x: 792, y: 502, fontSize: 30 },
  right3: { x: 575, y: 502, fontSize: 30 },
  right4: { x: 626, y: 502, fontSize: 20 },
  bottom1: { x: 502, y: 741, fontSize: 20 },
  bottom2: { x: 502, y: 793, fontSize: 30 },
  upLeft1: { x: 295, y: 295, fontSize: 30 },
  upLeft2: { x: 333, y: 333, fontSize: 20 },
  upRight1: { x: 706, y: 295, fontSize: 30 },
  upRight2: { x: 671, y: 333, fontSize: 20 },
  downLeft2: { x: 333, y: 671, fontSize: 20 },
  downLeft3: { x: 295, y: 707, fontSize: 30 },
  downRight1: { x: 671, y: 671, fontSize: 20 },
  downRight2: { x: 707, y: 707, fontSize: 30 },
  moneyLove1: { x: 610, y: 610, fontSize: 20 },
  moneyLove2: { x: 672, y: 548, fontSize: 20 },
  moneyLove3: { x: 548, y: 673, fontSize: 20 },
};

const PROGNOSI_SEGMENTI = [
  { decade: "0_10", from: "eta0", to: "eta10" },
  { decade: "10_20", from: "eta10", to: "eta20" },
  { decade: "20_30", from: "eta20", to: "eta30" },
  { decade: "30_40", from: "eta30", to: "eta40" },
  { decade: "40_50", from: "eta40", to: "eta50" },
  { decade: "50_60", from: "eta50", to: "eta60" },
  { decade: "60_70", from: "eta60", to: "eta70" },
  { decade: "70_0", from: "eta70", to: "eta0" },
];

const PROGNOSI_PERIODI = ["a", "b", "c", "d", "e", "f", "g"];

const MOSTRA_MAPPA_GUIDA = false; // Imposta a true per mostrare la mappa guida, false per nasconderla
const INCLUDE_GUIDA_NELL_EXPORT = false;

const DESCRIZIONI_CENTRO = {
  1: {
    titolo: "Il Mago",
    adulto:
      "Ti senti a tuo agio quando puoi prendere iniziativa e avere il controllo diretto su un progetto, senza dover aspettare l'approvazione altrui. Il tuo comfort psicologico nasce dall'autonomia decisionale e dalla possibilità di trasformare un'idea in azione concreta. Situazioni che richiedono passività o attesa prolungata possono generarti disagio.",
    bambino:
      "Il bambino trova sicurezza in attività che gli permettono di sperimentare in prima persona, senza troppe istruzioni imposte dall'esterno. Ha bisogno di spazi in cui sbagliare e riprovare da solo, sviluppando fiducia nelle proprie capacità. Si sente a disagio quando viene costantemente guidato o corretto durante il gioco.",
  },
  2: {
    titolo: "La Sacerdotessa",
    adulto:
      "Ti senti a tuo agio in ambienti tranquilli, dove puoi osservare prima di agire e riflettere senza fretta. Il tuo comfort nasce dal poter elaborare le cose internamente, lontano da pressioni sociali o richieste di risposte immediate. Il rumore, la fretta e l'esposizione eccessiva ti mettono a disagio.",
    bambino:
      "Il bambino si sente al sicuro in momenti di calma e silenzio, magari da solo con i suoi pensieri o in giochi tranquilli. Ha bisogno di tempo per osservare prima di partecipare, senza essere spinto a esporsi. Ambienti troppo rumorosi o affollati possono sopraffarlo.",
  },
  3: {
    titolo: "L'Imperatrice",
    adulto:
      "Ti senti a tuo agio quando puoi prenderti cura di qualcuno o qualcosa, creando un ambiente accogliente intorno a te. Il tuo comfort psicologico nasce dal nutrire relazioni e dal circondarti di bellezza e comodità. Contesti freddi, distaccati o privi di calore relazionale ti mettono a disagio.",
    bambino:
      "Il bambino si sente sicuro in ambienti caldi e accoglienti, dove può prendersi cura di qualcosa (un peluche, una pianta, un animale). Ha bisogno di contatto fisico rassicurante e di sentirsi nutrito emotivamente. Si sente a disagio in contesti freddi o poco affettuosi.",
  },
  4: {
    titolo: "L'Imperatore",
    adulto:
      "Ti senti a tuo agio quando hai una struttura chiara, regole definite e un ordine da seguire o da costruire. Il tuo comfort psicologico nasce dal senso di controllo e stabilità che deriva dall'organizzazione. L'imprevedibilità e il caos possono generarti forte disagio.",
    bambino:
      "Il bambino si sente sicuro con routine prevedibili e regole chiare da rispettare. Ha bisogno di sapere cosa succederà dopo e di avere punti fermi nella giornata. Cambiamenti improvvisi o mancanza di struttura possono renderlo ansioso.",
  },
  5: {
    titolo: "Il Papa (Gerofante)",
    adulto:
      "Ti senti a tuo agio quando puoi trasmettere conoscenza o far parte di un gruppo con valori condivisi. Il tuo comfort psicologico nasce dall'appartenenza e dal seguire (o insegnare) principi in cui credi. Sentirsi esclusi o privi di riferimenti solidi ti mette a disagio.",
    bambino:
      "Il bambino si sente sicuro quando può imparare da una figura di riferimento fidata e sentirsi parte di un gruppo. Ha bisogno di regole condivise e di sapere cosa è giusto e cosa no. Si sente a disagio quando manca una guida chiara o si sente escluso.",
  },
  6: {
    titolo: "Gli Amanti",
    adulto:
      "Ti senti a tuo agio quando puoi scegliere liberamente seguendo i tuoi valori, senza sentirti forzato in una direzione. Il tuo comfort psicologico nasce dall'armonia nelle relazioni e dalla libertà di decidere. Le imposizioni esterne o i conflitti di valore ti mettono a disagio.",
    bambino:
      "Il bambino si sente sicuro quando può scegliere tra opzioni, anche piccole, e sentirsi ascoltato nelle sue preferenze. Ha bisogno di relazioni armoniose intorno a sé, senza tensioni. Litigi o imposizioni rigide possono metterlo a disagio.",
  },
  7: {
    titolo: "Il Carro",
    adulto:
      "Ti senti a tuo agio quando sei in movimento verso un obiettivo, con una direzione chiara da seguire. Il tuo comfort psicologico nasce dalla sensazione di avanzamento e conquista. La stasi prolungata o la mancanza di progressi ti mettono a disagio.",
    bambino:
      "Il bambino si sente sicuro quando ha una sfida o un traguardo da raggiungere, qualcosa che lo tiene attivo e motivato. Ha bisogno di muoversi, fare, andare avanti. Situazioni troppo statiche o ripetitive possono annoiarlo e agitarlo.",
  },
  8: {
    titolo: "La Giustizia",
    adulto:
      "Ti senti a tuo agio in contesti equi, dove le regole valgono per tutti e le conseguenze sono logiche e prevedibili. Il tuo comfort psicologico nasce dal senso di correttezza ed equilibrio. Le ingiustizie o le decisioni arbitrarie ti mettono profondamente a disagio.",
    bambino:
      "Il bambino si sente sicuro quando le regole sono uguali per tutti e capisce perché certe cose sono permesse o vietate. Ha bisogno di coerenza tra ciò che viene detto e ciò che viene fatto. Le ingiustizie percepite (anche piccole) possono turbarlo molto.",
  },
  9: {
    titolo: "L'Eremita",
    adulto:
      "Ti senti a tuo agio quando hai tempo e spazio per stare da solo con i tuoi pensieri, lontano da richieste sociali. Il tuo comfort psicologico nasce dall'introspezione e dalla ricerca di senso personale. La socialità forzata o continua ti prosciuga e ti mette a disagio.",
    bambino:
      "Il bambino si sente sicuro quando può ritagliarsi momenti di gioco solitario, senza essere costantemente sollecitato a interagire. Ha bisogno di tempo per stare con sé stesso. Ambienti troppo sociali o esigenti possono stancarlo rapidamente.",
  },
  10: {
    titolo: "La Ruota della Fortuna",
    adulto:
      "Ti senti a tuo agio quando la vita porta cambiamenti e novità, e riesci ad adattarti con flessibilità. Il tuo comfort psicologico nasce dall'accettare che le cose cambiano e dal saperle cogliere. La rigidità e la monotonia prolungata ti mettono a disagio.",
    bambino:
      "Il bambino si sente sicuro quando può esplorare novità e imprevisti con curiosità, senza troppa ansia da controllo. Ha bisogno di varietà negli stimoli e nelle attività. La monotonia eccessiva può renderlo irrequieto.",
  },
  11: {
    titolo: "La Forza",
    adulto:
      "Ti senti a tuo agio quando puoi gestire le difficoltà con calma interiore, senza reagire d'impulso. Il tuo comfort psicologico nasce dalla pazienza e dal controllo emotivo che eserciti su te stesso, non sugli altri. Le situazioni che richiedono reazioni aggressive o impulsive ti mettono a disagio.",
    bambino:
      "Il bambino si sente sicuro quando gli viene data la possibilità di gestire le proprie emozioni con calma, senza fretta di reprimerle. Ha bisogno di sentirsi accompagnato con dolcezza nelle difficoltà. Le richieste brusche o punitive possono metterlo a disagio.",
  },
  12: {
    titolo: "L'Appeso",
    adulto:
      "Ti senti a tuo agio quando puoi fermarti, cambiare prospettiva e guardare le cose da un punto di vista diverso, senza fretta di agire. Il tuo comfort psicologico nasce dall'accettazione della pausa come momento utile. Essere spinto ad agire subito, senza tempo per riflettere, ti mette a disagio.",
    bambino:
      "Il bambino si sente sicuro quando ha tempo per guardare prima di partecipare, magari osservando gli altri giocare prima di unirsi. Ha bisogno di non essere forzato ad agire subito. Le pressioni a sbrigarsi possono metterlo a disagio.",
  },
  13: {
    titolo: "La Morte (Trasformazione)",
    adulto:
      "Ti senti a tuo agio quando puoi lasciare andare ciò che non serve più e rinnovarti, anche attraverso cambiamenti importanti. Il tuo comfort psicologico nasce dalla capacità di chiudere cicli e ricominciare. Restare bloccato in situazioni immutabili ti mette a disagio.",
    bambino:
      "Il bambino si sente sicuro quando può lasciare un gioco per un altro senza sensi di colpa, adattandosi ai cambiamenti di attività. Ha bisogno di essere accompagnato con serenità nei passaggi (nuova scuola, nuova fase). Le transizioni brusche o imposte possono spaventarlo.",
  },
  14: {
    titolo: "La Temperanza",
    adulto:
      "Ti senti a tuo agio quando riesci a trovare un equilibrio tra le diverse parti della tua vita, senza estremismi. Il tuo comfort psicologico nasce dalla moderazione e dall'armonizzare bisogni diversi. Gli eccessi, in qualunque direzione, ti mettono a disagio.",
    bambino:
      "Il bambino si sente sicuro in ambienti equilibrati, dove gioco, riposo e regole si alternano senza estremi. Ha bisogno di ritmi bilanciati, né troppo stimolanti né troppo rigidi. Gli sbalzi eccessivi (troppa attività o troppa noia) possono disorientarlo.",
  },
  15: {
    titolo: "Il Diavolo",
    adulto:
      "Ti senti a tuo agio quando puoi esprimere i tuoi desideri e la tua parte istintiva senza giudizio, con autenticità. Il tuo comfort psicologico nasce dal riconoscere e accettare i propri limiti e desideri senza reprimerli. Contesti eccessivamente moralistici o repressivi ti mettono a disagio.",
    bambino:
      "Il bambino si sente sicuro quando può esprimere i suoi bisogni e desideri senza sentirsi giudicato o etichettato come capriccioso. Ha bisogno di spazio per essere autentico anche nelle sue parti più istintive. Il giudizio costante può farlo sentire a disagio.",
  },
  16: {
    titolo: "La Torre",
    adulto:
      "Ti senti a tuo agio quando le cose sono stabili e prevedibili, e ti senti fortemente destabilizzato da crolli improvvisi o cambiamenti drastici. Il tuo comfort psicologico nasce dalla sicurezza strutturale. Le rotture improvvise mettono profondamente in crisi il tuo equilibrio.",
    bambino:
      "Il bambino si sente sicuro quando l'ambiente intorno a lui è stabile e senza scossoni improvvisi. Ha bisogno di essere preparato in anticipo ai cambiamenti importanti, anche piccoli. Le sorprese destabilizzanti o i litigi improvvisi possono spaventarlo molto.",
  },
  17: {
    titolo: "La Stella",
    adulto:
      "Ti senti a tuo agio quando puoi coltivare speranza e fiducia nel futuro, anche nei momenti difficili. Il tuo comfort psicologico nasce dall'ispirazione e dalla possibilità di sognare in grande. Il pessimismo cronico intorno a te o la mancanza di prospettive ti mettono a disagio.",
    bambino:
      "Il bambino si sente sicuro quando può sognare, immaginare e sperare, sentendosi incoraggiato nelle sue aspirazioni. Ha bisogno di adulti che alimentino la sua fiducia nel futuro. Un ambiente scoraggiante o critico può spegnere il suo entusiasmo.",
  },
  18: {
    titolo: "La Luna",
    adulto:
      "Ti senti a tuo agio quando puoi esplorare la tua sensibilità e le tue emozioni più profonde senza doverle spiegare razionalmente. Il tuo comfort psicologico nasce dall'accettazione dell'ambiguità e dell'intuito. Gli ambienti eccessivamente razionali o che negano le emozioni ti mettono a disagio.",
    bambino:
      "Il bambino si sente sicuro quando le sue emozioni, anche quelle confuse o difficili da spiegare, vengono accolte senza essere minimizzate. Ha bisogno di sentirsi capito anche quando non trova le parole giuste. Essere invitato a razionalizzare troppo presto può metterlo a disagio.",
  },
  19: {
    titolo: "Il Sole",
    adulto:
      "Ti senti a tuo agio quando puoi essere te stesso apertamente, con vitalità e senza maschere. Il tuo comfort psicologico nasce dalla gioia condivisa e dal riconoscimento positivo. Gli ambienti cupi o repressivi verso l'espressione di sé ti mettono a disagio.",
    bambino:
      "Il bambino si sente sicuro quando può essere spontaneo, giocoso e mostrarsi per quello che è, ricevendo approvazione e calore. Ha bisogno di essere visto e apprezzato apertamente. Un ambiente freddo o poco espressivo può farlo sentire a disagio.",
  },
  20: {
    titolo: "Il Giudizio",
    adulto:
      "Ti senti a tuo agio quando puoi fare un bilancio della tua vita e sentirti chiamato a un rinnovamento consapevole. Il tuo comfort psicologico nasce dal sentirti riconosciuto per il tuo percorso e dalla possibilità di ripartire con nuova consapevolezza. Sentirsi giudicati ingiustamente o non ascoltati ti mette a disagio.",
    bambino:
      "Il bambino si sente sicuro quando i suoi progressi vengono riconosciuti e valorizzati, sentendosi capito nel suo percorso di crescita. Ha bisogno di sentire che ogni errore è un'occasione per ricominciare, non una condanna. Il giudizio severo o le etichette possono farlo sentire a disagio.",
  },
  21: {
    titolo: "Il Mondo",
    adulto:
      "Ti senti a tuo agio quando puoi vedere il quadro d'insieme e sentire di aver completato qualcosa di significativo. Il tuo comfort psicologico nasce dal senso di realizzazione e integrazione delle diverse parti di te. Le situazioni frammentate o incompiute ti mettono a disagio.",
    bambino:
      "Il bambino si sente sicuro quando può portare a termine un'attività e vedere il risultato del proprio impegno. Ha bisogno di sentire un senso di completezza nelle cose che fa. Essere interrotto continuamente prima di finire può metterlo a disagio.",
  },
  22: {
    titolo: "Il Matto",
    adulto:
      "Ti senti a tuo agio quando puoi essere spontaneo, leggero e libero da aspettative e vincoli eccessivi. Il tuo comfort psicologico nasce dalla libertà di esplorare senza un piano rigido. Le strutture troppo rigide o le responsabilità eccessive ti mettono a disagio.",
    bambino:
      "Il bambino si sente sicuro quando può giocare liberamente, senza troppe regole o aspettative di prestazione. Ha bisogno di spazio per essere semplicemente sé stesso, in modo leggero e spontaneo. Le pressioni o le responsabilità premature possono metterlo a disagio.",
  },
};

function calcolaPosizionePrognosiSegmento(fromKey, toKey, indice) {
  const from = CERCHI[fromKey];
  const to = CERCHI[toKey];
  const centro = CERCHI.centro;

  if (!from || !to || !centro) {
    return null;
  }

  // Trasla tutto il blocco di 7 punti verso la fine del segmento,
  // lasciando un margine simmetrico prima del primo e dopo l'ultimo.
  const marginStart = 0.21;
  const marginEnd = 0.78;
  const t =
    marginStart +
    (indice / (PROGNOSI_PERIODI.length - 1)) * (marginEnd - marginStart);
  const baseX = from.x + (to.x - from.x) * t;
  const baseY = from.y + (to.y - from.y) * t;
  const vecX = baseX - centro.x;
  const vecY = baseY - centro.y;
  const modulo = Math.hypot(vecX, vecY) || 1;

  // Offset esterno maggiore per evitare sovrapposizioni con la matrice interna.
  const offset = 53;
  return {
    x: baseX + (vecX / modulo) * offset,
    y: baseY + (vecY / modulo) * offset,
    fontSize: 13,
    className: "numero-prognosi",
    fontWeight: "700",
    fill: "#3d4e49",
    fontFamily: "'Manrope', 'Segoe UI', sans-serif",
  };
}

function inizializzaPosizioniPrognosi() {
  PROGNOSI_SEGMENTI.forEach((segmento) => {
    PROGNOSI_PERIODI.forEach((periodo, indice) => {
      const key = `prog${segmento.decade}_${periodo}`;
      const pos = calcolaPosizionePrognosiSegmento(
        segmento.from,
        segmento.to,
        indice,
      );
      if (pos) CERCHI[key] = pos;
    });
  });
}

function calcolaPrognosiVita(valoriDecadi) {
  const prognosi = {};

  PROGNOSI_SEGMENTI.forEach((segmento) => {
    const F = valoriDecadi[segmento.from];
    const B = valoriDecadi[segmento.to];

    const d = riduciA22(F + B);
    const b = riduciA22(F + d);
    const a = riduciA22(F + b);
    const c = riduciA22(b + d);
    const f = riduciA22(d + B);
    const e = riduciA22(d + f);
    const g = riduciA22(f + B);

    const inOrdine = { a, b, c, d, e, f, g };
    PROGNOSI_PERIODI.forEach((periodo) => {
      const key = `prog${segmento.decade}_${periodo}`;
      prognosi[key] = inOrdine[periodo];
    });
  });

  return prognosi;
}

function centraTestoNelCerchio(textEl, pos) {
  const targetX = pos.x + (pos.dx || 0);
  const targetY = pos.y + (pos.dy || 0);

  // Il font ha metriche diverse (ascendenti/descendenti, kerning): usare
  // getBBox() per compensare rende il risultato dipendente dal font e dal
  // singolo carattere. Per centrare davvero sul punto desiderato, basta
  // posizionare il testo direttamente sul centro del punto e lasciare che
  // text-anchor="middle" e dominant-baseline="middle" facciano il loro lavoro.
  textEl.setAttribute("x", String(targetX));
  textEl.setAttribute("y", String(targetY));
}

function creaLayerSvg(id) {
  const matrixSvg = document.getElementById("matrixSvg");
  if (!matrixSvg) {
    return null;
  }

  let layer = document.getElementById(id);

  if (!layer) {
    layer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    layer.setAttribute("id", id);
    matrixSvg.appendChild(layer);
  }

  return layer;
}

function applicaStiliCalcolatiSvg(sourceRoot, targetRoot) {
  const sourceElements = [sourceRoot, ...sourceRoot.querySelectorAll("*")];
  const targetElements = [targetRoot, ...targetRoot.querySelectorAll("*")];
  const proprietàDaCopiare = [
    "fill",
    "fill-opacity",
    "stroke",
    "stroke-opacity",
    "stroke-width",
    "stroke-linecap",
    "stroke-linejoin",
    "font-family",
    "font-size",
    "font-style",
    "font-weight",
    "letter-spacing",
    "text-anchor",
    "dominant-baseline",
    "opacity",
    "visibility",
    "display",
    "filter",
    "clip-path",
    "paint-order",
  ];

  sourceElements.forEach((sourceEl, index) => {
    const targetEl = targetElements[index];
    if (!targetEl) return;

    const computed = window.getComputedStyle(sourceEl);
    const styleText = proprietàDaCopiare
      .map((property) => `${property}:${computed.getPropertyValue(property)}`)
      .join(";");

    if (styleText.trim()) {
      targetEl.setAttribute(
        "style",
        `${styleText};${targetEl.getAttribute("style") || ""}`,
      );
    }
  });
}

function disegnaMappaGuida() {
  const guideLayer = creaLayerSvg("guideLayer");
  if (!guideLayer) {
    return;
  }

  guideLayer.innerHTML = "";
  guideLayer.style.display = MOSTRA_MAPPA_GUIDA ? "block" : "none";

  if (!MOSTRA_MAPPA_GUIDA) return;

  Object.entries(CERCHI).forEach(([chiave, pos]) => {
    const x = pos.x;
    const y = pos.y;

    const marker = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    marker.setAttribute("cx", x);
    marker.setAttribute("cy", y);
    marker.setAttribute("r", "4");
    marker.setAttribute("class", "guida-marker");
    marker.setAttribute("fill", "#d7263d");
    marker.setAttribute("opacity", "0.9");
    guideLayer.appendChild(marker);

    const hLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line",
    );
    hLine.setAttribute("x1", x - 8);
    hLine.setAttribute("y1", y);
    hLine.setAttribute("x2", x + 8);
    hLine.setAttribute("y2", y);
    hLine.setAttribute("class", "guida-cross");
    hLine.setAttribute("stroke", "#d7263d");
    hLine.setAttribute("stroke-width", "1.5");
    hLine.setAttribute("opacity", "0.85");
    guideLayer.appendChild(hLine);

    const vLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line",
    );
    vLine.setAttribute("x1", x);
    vLine.setAttribute("y1", y - 8);
    vLine.setAttribute("x2", x);
    vLine.setAttribute("y2", y + 8);
    vLine.setAttribute("class", "guida-cross");
    vLine.setAttribute("stroke", "#d7263d");
    vLine.setAttribute("stroke-width", "1.5");
    vLine.setAttribute("opacity", "0.85");
    guideLayer.appendChild(vLine);

    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    label.setAttribute("x", x + 10);
    label.setAttribute("y", y - 10);
    label.setAttribute("class", "guida-label");
    label.setAttribute("fill", "#143642");
    label.setAttribute("font-size", "13");
    label.setAttribute("font-weight", "600");
    label.setAttribute("font-family", "Consolas, 'Courier New', monospace");
    label.textContent = `${chiave} (${x}, ${y})`;
    guideLayer.appendChild(label);
  });
}

async function toDataUrl(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Immagine non disponibile.");
    }

    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Errore conversione immagine."));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    return await immagineComeDataUrl(url);
  }
}

function immagineComeDataUrl(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Impossibile preparare l'immagine per l'export."));
        return;
      }

      context.drawImage(image, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () =>
      reject(
        new Error("Impossibile leggere l'immagine di sfondo per l'export."),
      );
    image.src = url;
  });
}

function scaricaBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function creaNomeFilePng() {
  const nomeInput = document.getElementById("nome");
  const dataInput = document.getElementById("dataNascita");
  const nome = (nomeInput?.value || "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
  const data = dataInput?.value || "senza-data";

  if (!nome) {
    return `matrice-destino-${data}.png`;
  }

  return `matrice-destino-${nome}-${data}.png`;
}

async function esportaPng() {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const matrixSvg = document.getElementById("matrixSvg");
  const svgClone = matrixSvg.cloneNode(true);

  applicaStiliCalcolatiSvg(matrixSvg, svgClone);

  if (!INCLUDE_GUIDA_NELL_EXPORT) {
    const guide = svgClone.querySelector("#guideLayer");
    if (guide) {
      guide.remove();
    }
  }

  const imageEls = svgClone.querySelectorAll("image");
  for (const imageEl of imageEls) {
    const rawHref = imageEl.getAttribute("href");
    if (!rawHref || rawHref.startsWith("data:")) {
      continue;
    }

    const absUrl = new URL(rawHref, window.location.href).href;
    const dataUrl = await toDataUrl(absUrl);
    imageEl.setAttribute("href", dataUrl);
  }

  svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const serializedSvg = new XMLSerializer().serializeToString(svgClone);
  const svgBlob = new Blob([serializedSvg], {
    type: "image/svg+xml;charset=utf-8",
  });
  const svgUrl = URL.createObjectURL(svgBlob);

  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("Errore rendering SVG per export PNG."));
    img.src = svgUrl;
  });

  URL.revokeObjectURL(svgUrl);

  const viewBox = matrixSvg.viewBox.baseVal;
  const width = viewBox && viewBox.width ? viewBox.width : 1000;
  const height = viewBox && viewBox.height ? viewBox.height : 1000;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Impossibile inizializzare il canvas per l'export PNG.");
  }

  // Forza uno sfondo bianco nel PNG esportato.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  const pngBlob = await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Impossibile generare il PNG."));
        return;
      }
      resolve(blob);
    }, "image/png");
  });

  scaricaBlob(pngBlob, creaNomeFilePng());
}

// Riduzione numerologica nello spazio 1..22.
function riduciA22(numero) {
  let n = Math.abs(Number(numero)) || 0;
  if (n === 0) return 22;

  while (n > 22) {
    n = String(n)
      .split("")
      .reduce((acc, c) => acc + Number(c), 0);
  }

  return n === 0 ? 22 : n;
}

function sommaCifre(numero) {
  return String(Math.abs(Number(numero)) || 0)
    .split("")
    .reduce((acc, c) => acc + Number(c), 0);
}

function scomponiData(dataStr) {
  const [anno, mese, giorno] = dataStr.split("-").map(Number);
  return { giorno, mese, anno };
}

function calcolaMatrice(nome, dataNascita) {
  const { giorno, mese, anno } = scomponiData(dataNascita);

  const eta0 = riduciA22(giorno); // ok
  const eta20 = riduciA22(mese); // ok
  const eta40 = riduciA22(sommaCifre(anno)); // ok
  const eta10 = riduciA22(eta0 + eta20); // ok
  const eta30 = riduciA22(eta20 + eta40); // ok
  const eta60 = riduciA22(eta0 + eta20 + eta40); // ok
  const eta50 = riduciA22(eta40 + eta60); // ok
  const eta70 = riduciA22(eta60 + eta0); // ok

  const centro = riduciA22(eta0 + eta20 + eta40 + eta60); // ok

  const top2 = riduciA22(centro + eta20); // ok
  const top1 = riduciA22(eta20 + top2); // ok
  const top3 = riduciA22(top2 + centro); // ok

  const left2 = riduciA22(eta0 + centro); // ok
  const left1 = riduciA22(left2 + eta0); // ok
  const left3 = riduciA22(left2 + centro); // ok

  const right1 = riduciA22(eta40 + centro); //ok
  const right2 = riduciA22(right1 + eta40); //ok
  const right3 = riduciA22(eta10 + eta30 + eta50 + eta70); //ok
  const right4 = riduciA22(right3 + centro); //ok

  const bottom1 = riduciA22(eta60 + centro); //ok
  const bottom2 = riduciA22(bottom1 + eta60); //ok

  const upLeft1 = riduciA22(top1 + left1); //ok
  const upLeft2 = riduciA22(top2 + left2); //ok
  const upRight2 = riduciA22(eta30 + right3); //ok
  const upRight1 = riduciA22(upRight2 + eta30); // ok

  const downLeft2 = riduciA22(right3 + eta70); // ok
  const downLeft3 = riduciA22(downLeft2 + eta70); // ok

  const downRight1 = riduciA22(eta50 + right3); // ok
  const downRight2 = riduciA22(downRight1 + eta50); // ok

  const moneyLove1 = riduciA22(bottom1 + right1); //ok
  const moneyLove2 = riduciA22(moneyLove1 + right1); //ok
  const moneyLove3 = riduciA22(moneyLove1 + bottom1); //ok

  const prognosiVita = calcolaPrognosiVita({
    eta0,
    eta10,
    eta20,
    eta30,
    eta40,
    eta50,
    eta60,
    eta70,
  });

  return {
    eta0,
    eta10,
    eta20,
    eta30,
    eta40,
    eta50,
    eta60,
    eta70,
    centro,

    top1,
    top2,
    top3,

    left1,
    left2,
    left3,
    right1,
    right2,
    right3,
    right4,
    bottom1,
    bottom2,

    upLeft1,
    upLeft2,
    upRight1,
    upRight2,
    downLeft2,
    downLeft3,
    downRight1,
    downRight2,

    moneyLove1,
    moneyLove2,
    moneyLove3,

    ...prognosiVita,
  };
}

function disegnaMatrice(risultati) {
  const layer = creaLayerSvg("numeriLayer");
  if (!layer) {
    return;
  }

  layer.innerHTML = "";

  Object.entries(risultati).forEach(([chiave, valore]) => {
    const pos = CERCHI[chiave];
    if (!pos) return;

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", pos.x);
    text.setAttribute("y", pos.y);
    text.setAttribute("class", pos.className || "numero-punto");
    text.style.fontSize = `${pos.fontSize || 24}px`;
    text.setAttribute("fill", pos.fill || "#1a1a1a");
    text.setAttribute("font-weight", pos.fontWeight || "700");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute(
      "font-family",
      pos.fontFamily || "'Segoe UI', system-ui, sans-serif",
    );
    text.textContent = String(valore);

    layer.appendChild(text);
    centraTestoNelCerchio(text, pos);
  });

  disegnaMappaGuida();

  const matrixContainer = document.querySelector(".matrix-container");
  if (matrixContainer) {
    matrixContainer.classList.remove("updated");
    window.requestAnimationFrame(() => {
      matrixContainer.classList.add("updated");
    });

    window.setTimeout(() => {
      matrixContainer.classList.remove("updated");
    }, 500);
  }
}

function mostraDescrizioneCentro(numero, profilo) {
  const panel = document.getElementById("descrizioneCentro");
  const titolo = document.getElementById("comfortTitolo");
  const testo = document.getElementById("comfortTesto");
  const descrizione = DESCRIZIONI_CENTRO[numero];

  if (!panel || !titolo || !testo || !descrizione) return;

  titolo.textContent = `${numero} - ${descrizione.titolo}`;
  testo.textContent = descrizione[profilo];
  panel.hidden = false;
}

function initUiMotion() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealItems.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.16 },
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initBackToTop() {
  const backToTop = document.querySelector(".back-to-top");
  if (!backToTop) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const scrollMax =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollMax > 0 ? (scrollTop / scrollMax) * 100 : 0;
    const normalized = Math.min(100, Math.max(0, progress));

    backToTop.style.setProperty("--scroll-progress", `${normalized}%`);
  };

  if (prefersReducedMotion) {
    backToTop.classList.add("is-visible");
    updateProgress();
    return;
  }

  const onScroll = () => {
    const shouldShow = window.scrollY > 260;
    backToTop.classList.toggle("is-visible", shouldShow);
    updateProgress();
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

function initNavIndicator() {
  const nav = document.querySelector(".main-nav");
  if (!nav) {
    return;
  }

  const links = Array.from(nav.querySelectorAll(".nav-link"));
  if (!links.length) {
    return;
  }

  const activeLink =
    nav.querySelector('.nav-link[aria-current="page"]') ||
    nav.querySelector(".nav-link.is-active") ||
    links[0];

  const placeLine = (link) => {
    if (!link) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const left = linkRect.left - navRect.left;

    nav.style.setProperty("--nav-line-left", `${left}px`);
    nav.style.setProperty("--nav-line-width", `${linkRect.width}px`);
  };

  placeLine(activeLink);

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => placeLine(link));
    link.addEventListener("focus", () => placeLine(link));
  });

  nav.addEventListener("mouseleave", () => placeLine(activeLink));
  nav.addEventListener("focusout", (event) => {
    if (!nav.contains(event.relatedTarget)) {
      placeLine(activeLink);
    }
  });

  window.addEventListener("resize", () => placeLine(activeLink));
}

function initNavMagneticHover() {
  const nav = document.querySelector(".main-nav");
  if (!nav) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isTouchLike = window.matchMedia(
    "(hover: none), (pointer: coarse)",
  ).matches;

  if (prefersReducedMotion || isTouchLike) {
    return;
  }

  const links = nav.querySelectorAll(".nav-link");

  links.forEach((link) => {
    link.addEventListener("mousemove", (event) => {
      const rect = link.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;

      const strength = 3.2;
      const moveX = ((localX / rect.width) * 2 - 1) * strength;
      const moveY = ((localY / rect.height) * 2 - 1) * (strength * 0.7) - 1;

      link.style.setProperty("--mx", `${moveX.toFixed(2)}px`);
      link.style.setProperty("--my", `${moveY.toFixed(2)}px`);
    });

    const reset = () => {
      link.style.setProperty("--mx", "0px");
      link.style.setProperty("--my", "0px");
    };

    link.addEventListener("mouseleave", reset);
    link.addEventListener("blur", reset);
  });
}

const page = document.body.dataset.page || "home";

function mostraMappaAnimata() {
  const matrixPanelEl = document.querySelector(".matrix-panel");
  const matrixContainerEl = document.querySelector(".matrix-container");

  if (!matrixPanelEl || !matrixContainerEl) {
    return;
  }

  const firstReveal = !matrixPanelEl.classList.contains("is-active");

  if (firstReveal) {
    matrixPanelEl.classList.remove("is-locked");
  }

  matrixPanelEl.classList.add("is-active");
  matrixPanelEl.setAttribute("aria-hidden", "false");
  matrixContainerEl.classList.remove("reveal-play");
  window.requestAnimationFrame(() => {
    matrixContainerEl.classList.add("reveal-play");
  });

  window.setTimeout(() => {
    matrixContainerEl.classList.remove("reveal-play");
  }, 980);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    return;
  }
}

function initHomePageInteractions() {
  const btnCalcola = document.getElementById("btnCalcola");
  const btnExport = document.getElementById("btnExport");
  const inputNome = document.getElementById("nome");
  const inputData = document.getElementById("dataNascita");
  const erroreEl = document.getElementById("errore");

  if (!btnCalcola || !btnExport || !inputNome || !inputData || !erroreEl) {
    return;
  }

  btnExport.disabled = true;

  btnCalcola.addEventListener("click", () => {
    const nome = inputNome.value.trim();
    const data = inputData.value;
    const profilo = document.querySelector(
      'input[name="profilo"]:checked',
    ).value;

    erroreEl.hidden = true;

    if (!nome || !data) {
      erroreEl.textContent = "Inserisci nome e data di nascita.";
      erroreEl.hidden = false;
      return;
    }

    const risultati = calcolaMatrice(nome, data);
    disegnaMatrice(risultati);
    mostraDescrizioneCentro(risultati.centro, profilo);
    mostraMappaAnimata();
    btnExport.disabled = false;
  });

  btnExport.addEventListener("click", async () => {
    erroreEl.hidden = true;

    try {
      await esportaPng();
    } catch (error) {
      erroreEl.textContent = error.message || "Errore durante l'export PNG.";
      erroreEl.hidden = false;
    }
  });
}

function initPageShell() {
  inizializzaPosizioniPrognosi();
  disegnaMappaGuida();
  initUiMotion();
  initNavIndicator();
  initNavMagneticHover();
  initBackToTop();

  if (page === "home") {
    initHomePageInteractions();
  }
}

initPageShell();
