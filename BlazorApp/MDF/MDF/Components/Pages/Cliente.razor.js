import "/Components/Pages/Index.razor.js";

function initClientPlayer(root) {
  const player = root.querySelector("[data-client-player]");
  if (!player) {
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
