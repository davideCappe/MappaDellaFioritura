function initClientPlayer(root) {
  // Il player è renderizzato fuori dal contenitore data-client-page in Cliente.razor,
  // quindi non va cercato dentro root.
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

  const setTrack = (nextIndex) => {
    const normalizedIndex = (nextIndex + trackButtons.length) % trackButtons.length;
    const selectedButton = trackButtons[normalizedIndex];
    const trackUrl = selectedButton.dataset.trackUrl;
    const trackTitle = selectedButton.dataset.trackTitle ?? "Traccia";

    if (!trackUrl) {
      return;
    }

    currentIndex = normalizedIndex;

    trackButtons.forEach((button, index) => {
      const isActive = index === currentIndex;
      button.classList.toggle("is-active", isActive);

      const checkElement = button.querySelector(".chapter-check");
      if (checkElement) {
        checkElement.textContent = isActive ? "●" : "○";
      }
    });

    audio.src = trackUrl;
    audio.load();
    currentTrackTitle.textContent = trackTitle;
  };

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
