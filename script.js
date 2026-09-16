/* =========================================================
   MATRICE DEL DESTINO - script.js
   ========================================================= */

// Coordinate dei cerchi visibili nell'immagine (viewBox 1000x1000).
// Se necessario puoi rifinire qualche coordinata di pochi pixel.
const CERCHI = {
  eta0: { x: 121, y: 500, fontSize: 40 },
  eta10: { x: 233, y: 233, fontSize: 40 },
  eta20: { x: 501, y: 122, fontSize: 40 },
  eta30: { x: 768, y: 233, fontSize: 40 },
  eta40: { x: 879, y: 500, fontSize: 40 },
  eta50: { x: 768, y: 768, fontSize: 40 },
  eta60: { x: 501, y: 879, fontSize: 40 },
  eta70: { x: 233, y: 768, fontSize: 40 },
  centro: { x: 502, y: 500, fontSize: 50 },
  top1: { x: 501, y: 198, fontSize: 30 },
  top2: { x: 501, y: 252, fontSize: 20 },
  top3: { x: 501, y: 355, fontSize: 20 },
  left1: { x: 197, y: 500, fontSize: 30 },
  left2: { x: 251, y: 500, fontSize: 20 },
  left3: { x: 355, y: 500, fontSize: 20 },
  right1: { x: 750, y: 500, fontSize: 20 },
  right2: { x: 803, y: 500, fontSize: 30 },
  right3: { x: 576, y: 500, fontSize: 30 },
  right4: { x: 630, y: 500, fontSize: 20 },
  bottom1: { x: 501, y: 750, fontSize: 20 },
  bottom2: { x: 501, y: 803, fontSize: 30 },
  upLeft1: { x: 286, y: 286, fontSize: 30 },
  upLeft2: { x: 324, y: 324, fontSize: 20 },
  upRight1: { x: 714, y: 286, fontSize: 30 },
  upRight2: { x: 677, y: 324, fontSize: 20 },
  downLeft2: { x: 324, y: 677, fontSize: 20 },
  downLeft3: { x: 286, y: 714, fontSize: 30 },
  downRight1: { x: 677, y: 677, fontSize: 20 },
  downRight2: { x: 714, y: 714, fontSize: 30 },
  moneyLove1: { x: 613, y: 613, fontSize: 20 },
  moneyLove2: { x: 678, y: 548, fontSize: 20 },
  moneyLove3: { x: 548, y: 677, fontSize: 20 },
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

const DESCRIZIONI_CENTRO_EN = {
  1: {
    titolo: "The Magician",
    adulto:
      "You feel comfortable when you can take initiative and directly steer a project without waiting for other people's approval. Your psychological comfort comes from decision-making autonomy and the chance to turn an idea into concrete action. Situations that require passivity or long waiting can make you uneasy.",
    bambino:
      "The child feels safe in activities that let them experiment firsthand, without too many instructions imposed from outside. They need space to make mistakes and try again on their own, building confidence in their own abilities. They feel uncomfortable when they are constantly guided or corrected during play.",
  },
  2: {
    titolo: "The High Priestess",
    adulto:
      "You feel at ease in quiet environments where you can observe before acting and reflect without rushing. Your comfort comes from processing things internally, away from social pressure or demands for immediate answers. Noise, haste, and too much exposure unsettle you.",
    bambino:
      "The child feels safe in moments of calm and silence, perhaps alone with their thoughts or in quiet play. They need time to observe before joining in, without being pushed to expose themselves. Too much noise or crowds can overwhelm them.",
  },
  3: {
    titolo: "The Empress",
    adulto:
      "You feel comfortable when you can care for someone or something and create a warm environment around you. Your psychological comfort comes from nurturing relationships and surrounding yourself with beauty and ease. Cold, detached, or emotionally barren contexts make you uneasy.",
    bambino:
      "The child feels safe in warm, welcoming environments where they can care for something (a plush toy, a plant, an animal). They need reassuring physical contact and emotional nourishment. They feel uncomfortable in cold or unloving contexts.",
  },
  4: {
    titolo: "The Emperor",
    adulto:
      "You feel comfortable when there is a clear structure, defined rules, and an order to follow or build. Your psychological comfort comes from the sense of control and stability that organization provides. Unpredictability and chaos can make you very uneasy.",
    bambino:
      "The child feels safe with predictable routines and clear rules to follow. They need to know what comes next and have firm anchors in the day. Sudden changes or a lack of structure can make them anxious.",
  },
  5: {
    titolo: "The Hierophant",
    adulto:
      "You feel comfortable when you can transmit knowledge or be part of a group with shared values. Your psychological comfort comes from belonging and following (or teaching) principles you believe in. Feeling excluded or without solid reference points makes you uncomfortable.",
    bambino:
      "The child feels safe when they can learn from a trusted guide and feel part of a group. They need shared rules and to know what is right and what is not. They feel uncomfortable when there is no clear guidance or they feel left out.",
  },
  6: {
    titolo: "The Lovers",
    adulto:
      "You feel comfortable when you can choose freely according to your values, without feeling forced in one direction. Your psychological comfort comes from harmony in relationships and the freedom to decide. External impositions or value conflicts unsettle you.",
    bambino:
      "The child feels safe when they can choose from options, even small ones, and feel listened to in their preferences. They need harmonious relationships around them, without tension. Arguments or rigid impositions can make them uncomfortable.",
  },
  7: {
    titolo: "The Chariot",
    adulto:
      "You feel comfortable when you are moving toward a goal with a clear direction to follow. Your psychological comfort comes from the feeling of progress and achievement. Prolonged stagnation or lack of progress unsettles you.",
    bambino:
      "The child feels safe when they have a challenge or goal to reach, something that keeps them active and motivated. They need to move, do, and keep going. Too static or repetitive situations can bore and agitate them.",
  },
  8: {
    titolo: "Justice",
    adulto:
      "You feel comfortable in fair contexts, where the rules apply to everyone and consequences are logical and predictable. Your psychological comfort comes from a sense of correctness and balance. Injustice or arbitrary decisions deeply unsettle you.",
    bambino:
      "The child feels safe when rules are the same for everyone and they understand why some things are allowed and others are not. They need consistency between what is said and what is done. Perceived unfairness, even small, can deeply disturb them.",
  },
  9: {
    titolo: "The Hermit",
    adulto:
      "You feel comfortable when you have time and space to be alone with your thoughts, away from social demands. Your psychological comfort comes from introspection and the search for personal meaning. Forced or constant socializing drains you and unsettles you.",
    bambino:
      "The child feels safe when they can carve out moments of solitary play without being constantly prompted to interact. They need time to be with themselves. Overly social or demanding environments can tire them quickly.",
  },
  10: {
    titolo: "Wheel of Fortune",
    adulto:
      "You feel comfortable when life brings change and novelty and you can adapt with flexibility. Your psychological comfort comes from accepting that things change and knowing how to seize that momentum. Rigidity and prolonged monotony unsettle you.",
    bambino:
      "The child feels safe when they can explore novelty and surprises with curiosity, without too much anxiety about control. They need variety in stimuli and activities. Excessive monotony makes them restless.",
  },
  11: {
    titolo: "Strength",
    adulto:
      "You feel comfortable when you can handle difficulties with inner calm without reacting impulsively. Your psychological comfort comes from patience and emotional control exercised on yourself, not on others. Situations that require aggressive or impulsive reactions unsettle you.",
    bambino:
      "The child feels safe when they are given room to manage their emotions calmly, without being rushed to suppress them. They need to be gently accompanied through difficult moments. Harsh or punitive demands can make them uncomfortable.",
  },
  12: {
    titolo: "The Hanged Man",
    adulto:
      "You feel comfortable when you can pause, change perspective, and look at things from a different angle without rushing to act. Your psychological comfort comes from accepting the pause as a useful moment. Being pushed to act immediately, without time to reflect, unsettles you.",
    bambino:
      "The child feels safe when they have time to watch before joining in, perhaps observing others play before joining. They need not to be forced into acting right away. Pressure to hurry can make them uncomfortable.",
  },
  13: {
    titolo: "Death (Transformation)",
    adulto:
      "You feel comfortable when you can let go of what no longer serves you and renew yourself, even through major changes. Your psychological comfort comes from the ability to close cycles and start again. Remaining stuck in immutable situations unsettles you.",
    bambino:
      "The child feels safe when they can leave one game for another without guilt, adapting to changes in activity. They need to be gently accompanied through transitions (new school, new phase). Abrupt or forced transitions can frighten them.",
  },
  14: {
    titolo: "Temperance",
    adulto:
      "You feel comfortable when you can find balance between the different parts of your life without extremes. Your psychological comfort comes from moderation and harmonizing different needs. Excesses in any direction unsettle you.",
    bambino:
      "The child feels safe in balanced environments where play, rest, and rules alternate without extremes. They need rhythm that is neither overstimulating nor too rigid. Excessive swings (too much activity or too much boredom) can disorient them.",
  },
  15: {
    titolo: "The Devil",
    adulto:
      "You feel comfortable when you can express your desires and instinctive side without judgment, with authenticity. Your psychological comfort comes from recognizing and accepting your limits and desires without suppressing them. Excessively moralistic or repressive environments unsettle you.",
    bambino:
      "The child feels safe when they can express their needs and desires without feeling judged or labeled as spoiled. They need space to be authentic even in their most instinctive parts. Constant judgment can make them uncomfortable.",
  },
  16: {
    titolo: "The Tower",
    adulto:
      "You feel comfortable when things are stable and predictable, and you feel strongly destabilized by sudden collapses or drastic change. Your psychological comfort comes from structural security. Sudden breakdowns deeply disrupt your balance.",
    bambino:
      "The child feels safe when their environment is stable and free from sudden shocks. They need to be prepared in advance for important changes, even small ones. Disturbing surprises or sudden arguments can scare them a lot.",
  },
  17: {
    titolo: "The Star",
    adulto:
      "You feel comfortable when you can cultivate hope and trust in the future, even in difficult moments. Your psychological comfort comes from inspiration and the ability to dream big. Chronic pessimism around you or lack of perspective unsettles you.",
    bambino:
      "The child feels safe when they can dream, imagine, and hope, feeling encouraged in their aspirations. They need adults who nourish their confidence in the future. A discouraging or critical environment can extinguish their enthusiasm.",
  },
  18: {
    titolo: "The Moon",
    adulto:
      "You feel comfortable when you can explore your sensitivity and your deepest emotions without having to explain them rationally. Your psychological comfort comes from accepting ambiguity and intuition. Overly rational environments that deny emotion unsettle you.",
    bambino:
      "The child feels safe when their emotions, even confusing or hard to explain ones, are welcomed without being minimized. They need to feel understood even when they cannot find the right words. Being pushed to rationalize too early can make them uncomfortable.",
  },
  19: {
    titolo: "The Sun",
    adulto:
      "You feel comfortable when you can be yourself openly, with vitality and without masks. Your psychological comfort comes from shared joy and positive recognition. Dark or repressive environments toward self-expression unsettle you.",
    bambino:
      "The child feels safe when they can be spontaneous, playful, and show themselves as they are, receiving approval and warmth. They need to be seen and appreciated openly. A cold or unexpressive environment can make them uncomfortable.",
  },
  20: {
    titolo: "Judgement",
    adulto:
      "You feel comfortable when you can take stock of your life and feel called to conscious renewal. Your psychological comfort comes from being recognized for your path and from the possibility of starting again with new awareness. Being unjustly judged or not listened to unsettles you.",
    bambino:
      "The child feels safe when their progress is recognized and valued, feeling understood in their growth journey. They need to feel that every mistake is an opportunity to begin again, not a condemnation. Harsh judgment or labels can make them uncomfortable.",
  },
  21: {
    titolo: "The World",
    adulto:
      "You feel comfortable when you can see the bigger picture and feel that you have completed something significant. Your psychological comfort comes from a sense of realization and integration of different parts of yourself. Fragmented or unfinished situations unsettle you.",
    bambino:
      "The child feels safe when they can bring an activity to completion and see the result of their effort. They need to feel a sense of completeness in what they do. Being interrupted continuously before finishing can make them uncomfortable.",
  },
  22: {
    titolo: "The Fool",
    adulto:
      "You feel comfortable when you can be spontaneous, light, and free from excessive expectations and constraints. Your psychological comfort comes from the freedom to explore without a rigid plan. Structures that are too rigid or excessive responsibilities unsettle you.",
    bambino:
      "The child feels safe when they can play freely, without too many rules or performance expectations. They need space to simply be themselves, in a light and spontaneous way. Pressure or premature responsibilities can make them uncomfortable.",
  },
};

const TESTI_APP = {
  it: {
    immagine_non_disponibile: "Immagine non disponibile.",
    errore_conversione_immagine: "Errore conversione immagine.",
    errore_export_immagine:
      "Impossibile leggere l'immagine di sfondo per l'export.",
    errore_canvas: "Impossibile inizializzare il canvas per l'export PNG.",
    errore_png: "Impossibile generare il PNG.",
    inserisci_dati: "Inserisci nome e data di nascita.",
    errore_export: "Errore durante l'export PNG.",
    anni: "anni",
    anno: "anno",
    buon_compleanno: "Buon compleanno",
    titolo_mappa: "Mappa",
  },
  en: {
    immagine_non_disponibile: "Image unavailable.",
    errore_conversione_immagine: "Image conversion error.",
    errore_export_immagine: "Unable to read the background image for export.",
    errore_canvas: "Unable to initialize the canvas for PNG export.",
    errore_png: "Unable to generate the PNG.",
    inserisci_dati: "Enter name and date of birth.",
    errore_export: "Error during PNG export.",
    anni: "years",
    anno: "year",
    buon_compleanno: "Happy birthday",
    titolo_mappa: "Map",
  },
};

function getCurrentLanguage() {
  const htmlLang = document.documentElement.lang || "";
  if (htmlLang.toLowerCase().startsWith("en")) {
    return "en";
  }

  try {
    const saved = localStorage.getItem(CHIAVE_PREFERENZA_LINGUA);
    if (saved === "en") {
      return "en";
    }
  } catch (error) {
    // storage non disponibile: si usa la lingua della pagina
  }

  return window.location.pathname.includes("/en/") ? "en" : "it";
}

function syncLanguageStyles() {
  const lang = getCurrentLanguage();
  const message =
    lang === "en"
      ? "Click Calculate to reveal your map"
      : "Premi Calcola per rivelare la tua mappa";

  const lockMessage = document.querySelector("[data-lock-message]");
  if (lockMessage) {
    lockMessage.textContent = message;
  }
}

function t(key, fallback = "") {
  const lang = getCurrentLanguage();
  const map = TESTI_APP[lang] || TESTI_APP.it;
  return map[key] || TESTI_APP.it[key] || fallback || key;
}

function getCentroDescrizione(numero, profilo) {
  const descrizione = DESCRIZIONI_CENTRO[numero];
  if (!descrizione) {
    return null;
  }

  const isEnglish = getCurrentLanguage() === "en";
  const english = DESCRIZIONI_CENTRO_EN[numero];

  return {
    titolo:
      (isEnglish && english ? english.titolo : descrizione.titolo) ||
      descrizione.titolo,
    testo:
      (isEnglish && english ? english[profilo] : descrizione[profilo]) ||
      descrizione[profilo],
  };
}

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
  const offset = 57;
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
      throw new Error(t("immagine_non_disponibile"));
    }

    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () =>
        reject(new Error(t("errore_conversione_immagine")));
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
        reject(new Error(t("errore_export_immagine")));
        return;
      }

      context.drawImage(image, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => reject(new Error(t("errore_export_immagine")));
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

async function condividiOPng(blob, filename) {
  const file = new File([blob], filename, { type: "image/png" });
  const canShareFile =
    typeof navigator.share === "function" &&
    (!navigator.canShare || navigator.canShare({ files: [file] }));

  if (!canShareFile) {
    scaricaBlob(blob, filename);
    return;
  }

  try {
    await navigator.share({
      files: [file],
      title: "Mappa della Fioritura",
    });
  } catch (error) {
    console.log("share fallita:", error.name, error.message);
    if (error.name !== "AbortError") {
      scaricaBlob(blob, filename);
    }
  }
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

  svgClone.querySelectorAll(".numero-rivelato").forEach((text) => {
    const finalSize = text.style.getPropertyValue("--numero-size");
    text.style.setProperty("animation", "none");
    if (finalSize) {
      text.style.setProperty("font-size", finalSize);
    }
  });

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

  if (typeof image.decode === "function") {
    try {
      await image.decode();
    } catch {}
  }

  URL.revokeObjectURL(svgUrl);

  const viewBox = matrixSvg.viewBox.baseVal;
  const width = viewBox && viewBox.width ? viewBox.width : 1000;
  const height = viewBox && viewBox.height ? viewBox.height : 1000;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error(t("errore_canvas"));
  }

  // Forza uno sfondo bianco nel PNG esportato.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  const pngBlob = await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error(t("errore_png")));
        return;
      }
      resolve(blob);
    }, "image/png");
  });

  return pngBlob;
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

  Object.entries(risultati).forEach(([chiave, valore], indice) => {
    const pos = CERCHI[chiave];
    if (!pos) return;

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", pos.x);
    text.setAttribute("y", pos.y);
    text.setAttribute("class", pos.className || "numero-punto");
    text.style.setProperty("--numero-size", `${pos.fontSize || 24}px`);
    text.setAttribute("fill", pos.fill || "#1a1a1a");
    text.setAttribute("font-weight", pos.fontWeight || "700");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute(
      "font-family",
      pos.fontFamily || "'Segoe UI', system-ui, sans-serif",
    );
    text.classList.add("numero-rivelato");
    text.style.setProperty("--numero-delay", `${indice * 28}ms`);
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
  const descrizione = getCentroDescrizione(numero, profilo);

  if (!panel || !titolo || !testo || !descrizione) return;

  titolo.textContent = `${numero} - ${descrizione.titolo}`;
  testo.textContent = descrizione.testo;
  panel.hidden = false;
}

function calcolaEta(dataNascita) {
  const { anno, mese, giorno } = scomponiData(dataNascita);
  const oggi = new Date();
  let eta = oggi.getFullYear() - anno;
  const compleannoGiaPassato =
    oggi.getMonth() + 1 > mese ||
    (oggi.getMonth() + 1 === mese && oggi.getDate() >= giorno);

  if (!compleannoGiaPassato) {
    eta -= 1;
  }

  return eta;
}

function mostraEtaECompleanno(dataNascita) {
  const riepilogo = document.getElementById("riepilogoPersona");
  const etaEl = document.getElementById("etaPersona");

  if (etaEl) {
    const eta = calcolaEta(dataNascita);
    const unità = eta === 1 ? t("anno") : t("anni");
    etaEl.textContent = `${eta} ${unità}`;
  }

  if (riepilogo) {
    riepilogo.hidden = false;
  }
}

function celebraCompleanno(dataNascita, nome) {
  const matrixContainer = document.querySelector(".matrix-container");
  const matrixSvg = document.getElementById("matrixSvg");
  const logoOverlay = document.getElementById("logoOverlay");
  const { mese, giorno } = scomponiData(dataNascita);
  const oggi = new Date();

  if (!matrixContainer) return;

  window.clearTimeout(matrixContainer.birthdayTimer);
  matrixContainer.querySelector(".birthday-celebration")?.remove();
  matrixSvg?.querySelector(".birthday-svg-celebration")?.remove();
  matrixContainer.classList.remove("is-birthday");
  logoOverlay?.classList.remove("is-birthday-bloom");

  if (oggi.getMonth() + 1 !== mese || oggi.getDate() !== giorno) return;

  matrixContainer.classList.add("is-birthday");
  logoOverlay?.classList.add("is-birthday-bloom");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    matrixContainer.birthdayTimer = window.setTimeout(() => {
      matrixContainer.classList.remove("is-birthday");
      logoOverlay?.classList.remove("is-birthday-bloom");
    }, 4600);
    return;
  }

  const particles = document.createElement("div");
  particles.className = "birthday-celebration birthday-particles";
  particles.setAttribute("aria-hidden", "true");

  const colori = ["#d98a63", "#c86d51", "#d0a44c", "#8da184"];

  Array.from({ length: 46 }, (_, index) => {
    const particle = document.createElement("span");
    const angle = (Math.PI * 2 * (index % 8)) / 8;
    const distance = 14 + Math.floor(index / 8) * 6 + Math.random() * 2;
    particle.textContent = index % 4 === 0 ? "\u2726" : "\u00b7";
    particle.style.setProperty("--x", `${50 + Math.cos(angle) * distance}%`);
    particle.style.setProperty("--y", `${50 + Math.sin(angle) * distance}%`);
    particle.style.setProperty("--delay", `${Math.random() * 0.5}s`);
    particle.style.setProperty("--size", `${0.7 + Math.random() * 1.05}rem`);
    particle.style.setProperty("--color", colori[index % colori.length]);
    particles.appendChild(particle);
  });

  const saluto = document.createElement("div");
  saluto.className = "birthday-greeting";
  saluto.innerHTML = `<p>${t("buon_compleanno")}</p><strong></strong>`;
  saluto.querySelector("strong").textContent = nome;
  particles.appendChild(saluto);

  if (matrixSvg) {
    const svgNamespace = "http://www.w3.org/2000/svg";
    const layer = document.createElementNS(svgNamespace, "g");
    const anello = document.createElementNS(svgNamespace, "circle");
    layer.setAttribute("class", "birthday-svg-celebration");
    anello.setAttribute("class", "birthday-center-ring");
    anello.setAttribute("cx", "502");
    anello.setAttribute("cy", "502");
    anello.setAttribute("r", "46");
    layer.appendChild(anello);
    matrixSvg.appendChild(layer);
  }

  matrixContainer.appendChild(particles);
  matrixContainer.birthdayTimer = window.setTimeout(() => {
    particles.remove();
    matrixSvg?.querySelector(".birthday-svg-celebration")?.remove();
    matrixContainer.classList.remove("is-birthday");
    logoOverlay?.classList.remove("is-birthday-bloom");
  }, 4600);
}

function mostraApprofondimentiMappa() {
  const panel = document.getElementById("approfondimentiMappa");
  if (panel) {
    panel.hidden = false;
  }
}

function aggiornaTesseraSanitaria(risultati) {
  const valoriFisici = [
    risultati.eta0,
    risultati.left1,
    risultati.left2,
    risultati.left3,
    risultati.centro,
    risultati.right1,
    risultati.eta40,
  ];
  const valoriEnergia = [
    risultati.eta20,
    risultati.top1,
    risultati.top2,
    risultati.top3,
    risultati.centro,
    risultati.bottom1,
    risultati.eta60,
  ];
  const righe = document.querySelectorAll(".health-table tbody tr");

  righe.forEach((riga, indice) => {
    const celle = riga.querySelectorAll("td");
    const valoreFisico = valoriFisici[indice];
    const valoreEnergetico = valoriEnergia[indice];

    if (
      celle.length !== 3 ||
      valoreFisico === undefined ||
      valoreEnergetico === undefined
    ) {
      return;
    }

    celle[0].textContent = valoreFisico;
    celle[1].textContent = valoreEnergetico;
    celle[2].textContent = riduciA22(valoreFisico + valoreEnergetico);
  });

  const rigaTotali = righe[7];
  const celleTotali = rigaTotali?.querySelectorAll("td");
  if (celleTotali?.length !== 3) {
    return;
  }

  const valoriEmotivi = valoriFisici.map((valoreFisico, indice) =>
    riduciA22(valoreFisico + valoriEnergia[indice]),
  );

  celleTotali[0].textContent = riduciA22(
    valoriFisici.reduce((totale, valore) => totale + valore, 0),
  );
  celleTotali[1].textContent = riduciA22(
    valoriEnergia.reduce((totale, valore) => totale + valore, 0),
  );
  celleTotali[2].textContent = riduciA22(
    valoriEmotivi.reduce((totale, valore) => totale + valore, 0),
  );
}

function aggiornaApprofondimentiMappa(risultati) {
  const terra = riduciA22(risultati.eta0 + risultati.eta40);
  const cielo = riduciA22(risultati.eta20 + risultati.eta60);
  const totaleRicerca = riduciA22(terra + cielo);
  const maschile = riduciA22(risultati.eta10 + risultati.eta50);
  const femminile = riduciA22(risultati.eta30 + risultati.eta70);
  const totaleSocializzazione = riduciA22(maschile + femminile);
  const armoniaSpirituale = riduciA22(totaleRicerca + totaleSocializzazione);
  const planetario = riduciA22(totaleSocializzazione + armoniaSpirituale);
  const valori = {
    valoreTerra: terra,
    valoreCielo: cielo,
    valoreRicercaTotale: totaleRicerca,
    valoreSocialeM: maschile,
    valoreSocialeF: femminile,
    valoreSocialeTotale: totaleSocializzazione,
    valoreSpirituale: armoniaSpirituale,
    valorePlanetario: planetario,
  };

  Object.entries(valori).forEach(([id, valore]) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.textContent = valore;
    }
  });
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

  const links = Array.from(nav.querySelectorAll(".nav-link:not(.nav-lang)"));
  if (!links.length) {
    return;
  }

  const getActiveLink = () =>
    nav.querySelector('.nav-link[aria-current="page"]') ||
    nav.querySelector(".nav-link.is-active") ||
    links[0];

  const placeLine = (link) => {
    const target = link || getActiveLink();
    if (!target) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = target.getBoundingClientRect();
    const left = linkRect.left - navRect.left;

    nav.style.setProperty("--nav-line-left", `${left}px`);
    nav.style.setProperty("--nav-line-width", `${linkRect.width}px`);
  };

  window.updateNavLine = placeLine;

  placeLine(getActiveLink());

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => placeLine(link));
    link.addEventListener("focus", () => placeLine(link));
  });

  nav.addEventListener("mouseleave", () => placeLine(getActiveLink()));
  nav.addEventListener("focusout", (event) => {
    if (!nav.contains(event.relatedTarget)) {
      placeLine(getActiveLink());
    }
  });

  window.addEventListener("resize", () => placeLine(getActiveLink()));
}

function initNavScrollSurface() {
  const nav = document.querySelector(".main-nav");
  if (!nav) {
    return;
  }

  const updateSurface = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 48);
  };

  updateSurface();
  window.addEventListener("scroll", updateSurface, { passive: true });
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

  const links = nav.querySelectorAll(".nav-link:not(.nav-lang)");

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

function mostraMappaAnimata() {
  const matrixPanelEl = document.querySelector(".matrix-panel");
  const matrixContainerEl = document.querySelector(".matrix-container");

  if (!matrixPanelEl || !matrixContainerEl) {
    return;
  }

  if (!matrixPanelEl.classList.contains("is-active")) {
    matrixPanelEl.classList.remove("is-locked");
  }

  matrixPanelEl.classList.add("is-active");
  matrixPanelEl.setAttribute("aria-hidden", "false");
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

  let exportPngPromise = null;
  btnExport.disabled = true;

  btnCalcola.addEventListener("click", () => {
    const nome = inputNome.value.trim();
    const data = inputData.value;
    const profilo = document.querySelector(
      'input[name="profilo"]:checked',
    ).value;

    erroreEl.hidden = true;

    if (!nome || !data) {
      erroreEl.textContent = t("inserisci_dati");
      erroreEl.hidden = false;
      return;
    }

    btnExport.disabled = true;
    const risultati = calcolaMatrice(nome, data);
    disegnaMatrice(risultati);
    mostraDescrizioneCentro(risultati.centro, profilo);
    mostraEtaECompleanno(data);
    celebraCompleanno(data, nome);
    aggiornaTesseraSanitaria(risultati);
    aggiornaApprofondimentiMappa(risultati);
    mostraApprofondimentiMappa();
    mostraMappaAnimata();

    exportPngPromise = esportaPng();
    const currentExport = exportPngPromise;
    currentExport
      .then(() => {
        if (exportPngPromise === currentExport) {
          btnExport.disabled = false;
        }
      })
      .catch((error) => {
        if (exportPngPromise === currentExport) {
          btnExport.disabled = true;
          erroreEl.textContent = error.message || t("errore_export");
          erroreEl.hidden = false;
        }
      });
  });

  btnExport.addEventListener("click", async () => {
    erroreEl.hidden = true;

    try {
      if (!exportPngPromise) {
        return;
      }

      const pngBlob = await exportPngPromise;
      await condividiOPng(pngBlob, creaNomeFilePng());
    } catch (error) {
      erroreEl.textContent = error.message || t("errore_export");
      erroreEl.hidden = false;
    }
  });
}

function aggiornaAnnoCopyright() {
  const annoCopyright = document.getElementById("annoCopyright");
  if (annoCopyright) {
    annoCopyright.textContent = new Date().getFullYear();
  }
}

function mostraPaginaDopoCaricamentoFont() {
  const pageReady = () => document.body.classList.remove("page-loading");
  const fontReady = document.fonts?.ready || Promise.resolve();

  Promise.race([
    fontReady,
    new Promise((resolve) => window.setTimeout(resolve, 900)),
  ]).then(pageReady);
}

const pageHtmlCache = new Map();

function updateNavIndicatorLine(targetLink) {
  if (typeof window.updateNavLine === "function") {
    window.updateNavLine(targetLink);
  }
}

function setActiveNavLink(targetUrl) {
  const nav = document.querySelector(".main-nav");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll(".nav-link:not(.nav-lang)"));
  const targetPath =
    (targetUrl.pathname || "").split("/").pop() || "index.html";

  let matchedLink = null;
  links.forEach((link) => {
    const linkHref = link.getAttribute("href") || "";
    const linkPath = linkHref.split("/").pop().split("#")[0] || "index.html";
    const isActive = linkPath === targetPath;

    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
      matchedLink = link;
    } else {
      link.removeAttribute("aria-current");
    }
  });

  aggiornaSelettoreLingua(targetUrl);
  updateNavIndicatorLine(matchedLink);
}

// Elenco centralizzato delle lingue disponibili: per aggiungerne una nuova
// basta aggiungere una voce qui (folder "" = radice del sito).
const LINGUE_SUPPORTATE = [
  { code: "it", folder: "", label: "IT" },
  { code: "en", folder: "en", label: "EN" },
];

const CHIAVE_PREFERENZA_LINGUA = "mappaFioritura:lingua";

function salvaPreferenzaLingua(codiceLingua) {
  try {
    localStorage.setItem(CHIAVE_PREFERENZA_LINGUA, codiceLingua);
  } catch (error) {
    // Storage non disponibile (es. modalità privata): nessuna preferenza salvata.
  }
}

function calcolaHrefLingua(currentFolder, targetFolder, filename) {
  if (!currentFolder) {
    return targetFolder ? `${targetFolder}/${filename}` : filename;
  }
  return targetFolder ? `../${targetFolder}/${filename}` : `../${filename}`;
}

// La nav non viene ricreata durante le transizioni SPA: il gruppo lingue va
// rigenerato ad ogni navigazione in base alla pagina effettivamente mostrata.
function aggiornaSelettoreLingua(targetUrl) {
  const nav = document.querySelector(".main-nav");
  const gruppo = nav?.querySelector(".nav-lang-group");
  if (!gruppo) return;

  const segments = (targetUrl.pathname || "").split("/").filter(Boolean);
  const currentFolder = LINGUE_SUPPORTATE.some(
    (lingua) => lingua.folder && lingua.folder === segments[0],
  )
    ? segments[0]
    : "";
  const filename = segments[segments.length - 1] || "index.html";

  gruppo.innerHTML = LINGUE_SUPPORTATE.map((lingua, indice) => {
    const separatore =
      indice === 0
        ? ""
        : '<span class="nav-lang-sep" aria-hidden="true">&middot;</span>';

    if (lingua.folder === currentFolder) {
      return `${separatore}<span class="nav-lang is-current" lang="${lingua.code}" aria-current="true">${lingua.label}</span>`;
    }

    const href = calcolaHrefLingua(currentFolder, lingua.folder, filename);
    return `${separatore}<a class="nav-lang" href="${href}" hreflang="${lingua.code}" lang="${lingua.code}">${lingua.label}</a>`;
  }).join("");
}

async function navigatePage(destination, pushHistory = true) {
  const currentUrl = new URL(window.location.href);
  const targetUrl = new URL(destination, window.location.href);

  if (
    targetUrl.origin === currentUrl.origin &&
    targetUrl.pathname === currentUrl.pathname &&
    targetUrl.search === currentUrl.search
  ) {
    if (targetUrl.hash) {
      const targetEl = document.querySelector(targetUrl.hash);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }
    return;
  }

  const pageContent = document.getElementById("page-content");
  if (!pageContent) {
    window.location.href = targetUrl.href;
    return;
  }

  setActiveNavLink(targetUrl);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!prefersReducedMotion) {
    pageContent.classList.add("page-content-exiting");
  }

  try {
    let htmlText = pageHtmlCache.get(targetUrl.href);
    if (!htmlText) {
      const res = await fetch(targetUrl.href);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      htmlText = await res.text();
      pageHtmlCache.set(targetUrl.href, htmlText);
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const newContent = doc.getElementById("page-content");

    if (!newContent) {
      window.location.href = targetUrl.href;
      return;
    }

    if (!prefersReducedMotion) {
      await new Promise((resolve) => window.setTimeout(resolve, 140));
    }

    document.title = doc.title;
    const newPageType = doc.body.dataset.page || "home";
    document.body.dataset.page = newPageType;

    pageContent.innerHTML = newContent.innerHTML;

    if (pushHistory) {
      window.history.pushState({ page: targetUrl.href }, "", targetUrl.href);
    }

    if (targetUrl.hash) {
      const hashEl = document.querySelector(targetUrl.hash);
      if (hashEl) {
        hashEl.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    initCurrentPage(newPageType);

    if (!prefersReducedMotion) {
      pageContent.classList.remove("page-content-exiting");
      pageContent.classList.add("page-content-entering");
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          pageContent.classList.remove("page-content-entering");
        });
      });
    }
  } catch (error) {
    console.warn("Transizione fluida fallback a caricamento standard:", error);
    window.location.href = targetUrl.href;
  }
}

function prefetchNavPages() {
  const links = document.querySelectorAll(".main-nav a[href]:not(.nav-lang)");
  links.forEach((link) => {
    const dest = new URL(link.href, window.location.href);
    if (
      dest.origin === window.location.origin &&
      !pageHtmlCache.has(dest.href)
    ) {
      fetch(dest.href)
        .then((res) => {
          if (res.ok) return res.text();
          throw new Error("Fetch failed");
        })
        .then((html) => pageHtmlCache.set(dest.href, html))
        .catch(() => {});
    }
  });
}

function initPageTransitions() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.hasAttribute("download") ||
      link.target === "_blank"
    ) {
      return;
    }

    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:")
    ) {
      return;
    }

    // Il cambio lingua ricarica la pagina intera: la nav differisce tra IT ed EN
    // e non viene ricostruita dalla transizione SPA (che sostituisce solo #page-content).
    if (link.classList.contains("nav-lang")) {
      salvaPreferenzaLingua(link.getAttribute("hreflang") || link.lang);
      return;
    }

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) {
      return;
    }

    if (
      destination.pathname === window.location.pathname &&
      destination.search === window.location.search &&
      destination.hash
    ) {
      return;
    }

    event.preventDefault();
    navigatePage(destination, true);
  });

  window.addEventListener("popstate", () => {
    navigatePage(new URL(window.location.href), false);
  });
}

function initMobileServicesAccordion() {
  const sections = document.querySelectorAll(
    ".services-catalogue > details.service-section",
  );
  if (!sections.length) return;

  const mobileQuery = window.matchMedia("(max-width: 760px)");

  const syncSections = () => {
    sections.forEach((section, index) => {
      section.open = !mobileQuery.matches || index === 0;
    });
  };

  document.querySelectorAll(".services-index a").forEach((link) => {
    link.addEventListener("click", () => {
      const target = document.querySelector(link.hash);
      if (target?.matches("details.service-section")) {
        target.open = true;
      }
    });
  });

  syncSections();
  mobileQuery.addEventListener("change", syncSections);
}

function initCurrentPage(pageName) {
  const currentPage = pageName || document.body.dataset.page || "home";

  if (currentPage === "home") {
    inizializzaPosizioniPrognosi();
    disegnaMappaGuida();
    initHomePageInteractions();
  } else if (currentPage === "services") {
    initMobileServicesAccordion();
  }

  initUiMotion();
  aggiornaAnnoCopyright();
}

function initPageShell() {
  syncLanguageStyles();
  initNavIndicator();
  initNavScrollSurface();
  initNavMagneticHover();
  initBackToTop();
  aggiornaAnnoCopyright();
  mostraPaginaDopoCaricamentoFont();
  initPageTransitions();
  initCurrentPage();

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(prefetchNavPages);
  } else {
    window.setTimeout(prefetchNavPages, 800);
  }
}

initPageShell();
