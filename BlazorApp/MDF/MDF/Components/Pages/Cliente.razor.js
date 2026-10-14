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

function initClientPage() {
  const root = document.querySelector("[data-client-page]");
  if (!root) {
    return;
  }

  initClientPlayer(root);
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
