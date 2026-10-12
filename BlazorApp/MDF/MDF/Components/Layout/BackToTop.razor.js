let backToTop;
let scrollHandler;
let resizeHandler;
let clickHandler;

function updateProgress() {
  if (!backToTop) {
    return;
  }

  const scrollTop = window.scrollY;
  const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollMax > 0 ? (scrollTop / scrollMax) * 100 : 0;
  const normalized = Math.min(100, Math.max(0, progress));

  backToTop.style.setProperty("--scroll-progress", `${normalized}%`);
}

function updateVisibility() {
  if (!backToTop) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shouldShow = prefersReducedMotion || window.scrollY > 260;

  backToTop.classList.toggle("is-visible", shouldShow);
  updateProgress();
}

export function initializeBackToTop(element) {
  disposeBackToTop();

  backToTop = element;
  if (!backToTop) {
    return;
  }

  clickHandler = (event) => {
    event.preventDefault();

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  scrollHandler = () => updateVisibility();
  resizeHandler = () => updateVisibility();

  backToTop.addEventListener("click", clickHandler);
  window.addEventListener("scroll", scrollHandler, { passive: true });
  window.addEventListener("resize", resizeHandler);

  updateVisibility();
}

export function disposeBackToTop() {
  if (backToTop && clickHandler) {
    backToTop.removeEventListener("click", clickHandler);
  }

  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler);
  }

  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
  }

  backToTop = undefined;
  scrollHandler = undefined;
  resizeHandler = undefined;
  clickHandler = undefined;
}

function bootBackToTop() {
  const element = document.querySelector(".back-to-top");
  if (!element) {
    disposeBackToTop();
    return;
  }

  if (element === backToTop && clickHandler) {
    updateVisibility();
    return;
  }

  initializeBackToTop(element);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootBackToTop);
} else {
  bootBackToTop();
}

window.Blazor?.addEventListener("enhancedload", bootBackToTop);
