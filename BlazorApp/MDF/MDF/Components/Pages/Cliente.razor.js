// Associazioni dimostrative: i punti sono fissi, senza significato interpretativo.
const demoTrackHighlights = new Map([  
    ["RITRATTO", ["eta0", "left1", "left2"]],
    ["TALENTI", ["eta20", "top1", "top2", "eta10", "eta30"]],
    ["KARMA MATERIALE", ["eta40", "right1", "right2"]],
    ["LINEA DEL DENARO", ["moneyLove1", "moneyLove2", "right1"]],
    ["LINEA DELLE RELAZIONI", ["moneyLove1", "moneyLove3", "bottom1"]],
    ["CODA KARMICA", ["eta60", "bottom1", "bottom2"]],
    ["COMFORT ZONE", ["centro"]],  
]);

function highlightClientMatrix(root, title) {
  const svg = root.querySelector("[data-client-matrix] svg");
  if (!svg) {
    return;
  }

  svg.querySelector("[data-audio-highlights]")?.remove();
  svg.querySelectorAll(".is-audio-highlighted").forEach((number) => {
    number.classList.remove("is-audio-highlighted");
  });

  const normalizedTitle = title.trim().replace(/\s+/g, " ").toLocaleUpperCase("it-IT");
  const points = demoTrackHighlights.get(normalizedTitle);
  if (!points) {
    return;
  }

  const namespace = "http://www.w3.org/2000/svg";
  const highlights = document.createElementNS(namespace, "g");
  highlights.setAttribute("data-audio-highlights", "");
  highlights.setAttribute("aria-hidden", "true");
  highlights.setAttribute("pointer-events", "none");

  points.forEach((point) => {
    const number = svg.querySelector(`[data-matrix-point="${point}"]`);
    if (!number) {
      return;
    }

    const halo = document.createElementNS(namespace, "circle");
    halo.setAttribute("cx", number.dataset.matrixX);
    halo.setAttribute("cy", number.dataset.matrixY);
    halo.setAttribute("r", number.dataset.matrixRadius);
    halo.classList.add("client-audio-halo");
    highlights.appendChild(halo);
    number.classList.add("is-audio-highlighted");
  });

  const numbersLayer = svg.querySelector("#numeriLayer");
  if (numbersLayer) {
    svg.insertBefore(highlights, numbersLayer);
  }
}

function initClientPlayer(root) {
  // Il player e renderizzato fuori dal contenitore data-client-page.
  const player = document.querySelector("[data-client-player]");
  if (!player || player.dataset.init === "1") {
    return;
  }

  const audio = player.querySelector("[data-client-audio]");
  const currentTrackTitle = player.querySelector("[data-current-track-title]");
  const trackButtons = Array.from(root.querySelectorAll("[data-track-button]"));

  if (!audio || !currentTrackTitle || trackButtons.length === 0) {
    return;
  }

  let currentIndex = trackButtons.findIndex((button) => button.classList.contains("is-active"));
  if (currentIndex < 0) {
    currentIndex = 0;
  }

  const updateHighlights = () => {
    const title = trackButtons[currentIndex].dataset.trackTitle ?? "";
    highlightClientMatrix(root, audio.ended ? "" : title);
  };

  root.addEventListener("clientmatrixready", updateHighlights);
  audio.addEventListener("play", updateHighlights);
  audio.addEventListener("error", () => highlightClientMatrix(root, ""));

  const hint = player.querySelector(".player-hint");
  const defaultHint = hint?.textContent;
  let playbackRequest = 0;

  const setTrack = async (nextIndex) => {
    const normalizedIndex = (nextIndex + trackButtons.length) % trackButtons.length;
    const selectedButton = trackButtons[normalizedIndex];
    const trackUrl = selectedButton.dataset.trackUrl;
    const trackTitle = selectedButton.dataset.trackTitle ?? "Traccia";

    if (!trackUrl) {
      console.error("La traccia selezionata non ha un URL audio.");
      if (hint) {
        hint.textContent = "La traccia selezionata non e disponibile.";
        hint.setAttribute("role", "status");
      }
      return;
    }

    const request = ++playbackRequest;
    currentIndex = normalizedIndex;

    trackButtons.forEach((button, index) => {
      const isActive = index === currentIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");

      const checkElement = button.querySelector(".chapter-check");
      if (checkElement) {
        checkElement.textContent = isActive ? "●" : "○";
      }
    });

    audio.src = trackUrl;
    audio.load();
    currentTrackTitle.textContent = trackTitle;
    updateHighlights();
    if (hint) {
      hint.textContent = defaultHint;
      hint.removeAttribute("role");
    }

    try {
      await audio.play();
    } catch (error) {
      if (request !== playbackRequest) {
        return;
      }

      console.error("Impossibile avviare la traccia selezionata.", error);
      if (hint) {
        hint.textContent = "Impossibile avviare la traccia automaticamente. Premi Play per continuare.";
        hint.setAttribute("role", "status");
      }
    }
  };

  audio.addEventListener("ended", () => {
    highlightClientMatrix(root, "");
    if (currentIndex >= trackButtons.length - 1) {
      return;
    }

    setTrack(currentIndex + 1);
  });

  updateHighlights();

  trackButtons.forEach((button, index) => {
    button.addEventListener("click", () => setTrack(index));
  });

  player
    .querySelector("[data-track-prev]")
    ?.addEventListener("click", () => setTrack(currentIndex - 1));

  player
    .querySelector("[data-track-next]")
    ?.addEventListener("click", () => setTrack(currentIndex + 1));

  player.dataset.init = "1";
}

function riduciA22(numero) {
  let n = Math.abs(Number(numero)) || 0;
  if (n === 0) {
    return 22;
  }

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

function calcolaScopiDaData(dataNascita) {
  const [anno, mese, giorno] = dataNascita.split("-").map(Number);
  if (!anno || !mese || !giorno) {
    return null;
  }

  const eta0 = riduciA22(giorno);
  const eta20 = riduciA22(mese);
  const eta40 = riduciA22(sommaCifre(anno));
  const eta10 = riduciA22(eta0 + eta20);
  const eta30 = riduciA22(eta20 + eta40);
  const eta60 = riduciA22(eta0 + eta20 + eta40);
  const eta50 = riduciA22(eta40 + eta60);
  const eta70 = riduciA22(eta60 + eta0);

  const terra = riduciA22(eta0 + eta40);
  const cielo = riduciA22(eta20 + eta60);
  const totaleRicerca = riduciA22(terra + cielo);
  const maschile = riduciA22(eta10 + eta50);
  const femminile = riduciA22(eta30 + eta70);
  const totaleSocializzazione = riduciA22(maschile + femminile);
  const armoniaSpirituale = riduciA22(totaleRicerca + totaleSocializzazione);
  const planetario = riduciA22(totaleSocializzazione + armoniaSpirituale);

  return {
    valoreTerra: terra,
    valoreCielo: cielo,
    valoreRicercaTotale: totaleRicerca,
    valoreSocialeM: maschile,
    valoreSocialeF: femminile,
    valoreSocialeTotale: totaleSocializzazione,
    valoreSpirituale: armoniaSpirituale,
    valorePlanetario: planetario,
  };
}

function initClientInsights() {
  const panel = document.querySelector(".client-insights-panel");
  if (!panel || panel.dataset.init === "1") {
    return;
  }

  const matrixHost = document.querySelector("[data-client-matrix]");
  if (!matrixHost) {
    return;
  }

  const birthDate = matrixHost.dataset.birthDate;
  if (!birthDate) {
    return;
  }

  const valori = calcolaScopiDaData(birthDate);
  if (!valori) {
    return;
  }

  Object.entries(valori).forEach(([id, valore]) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.textContent = String(valore);
    }
  });

  panel.dataset.init = "1";
}

function initClientPage() {
  const root = document.querySelector("[data-client-page]");
  if (!root) {
    return;
  }

  initClientPlayer(root);
  initClientInsights();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initClientPage, { once: true });
} else {
  initClientPage();
}

// In SSR statico con enhanced navigation, DOMContentLoaded non viene rieseguito.
// L'evento enhancedload va ascoltato sul document, non su window.Blazor.
// In questo modo l'inizializzazione del player avviene anche dopo navigazioni interne.
document.addEventListener("enhancedload", initClientPage);
