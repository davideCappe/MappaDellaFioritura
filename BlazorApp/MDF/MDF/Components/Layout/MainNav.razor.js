let navElement;
let navLinks = [];
let resizeHandler;
let mouseLeaveHandler;
let focusOutHandler;
let navScrollHandler;
let cleanupLinkHandlers = [];
let cleanupMagneticHandlers = [];

function getActiveLink() {
  if (!navElement) {
    return null;
  }

  return (
    navElement.querySelector('.nav-link[aria-current="page"]') ||
    navElement.querySelector(".nav-link.is-active") ||
    navLinks[0] ||
    null
  );
}

function placeLine(link) {
  if (!navElement) {
    return;
  }

  const target = link || getActiveLink();
  if (!target) {
    return;
  }

  const navRect = navElement.getBoundingClientRect();
  const linkRect = target.getBoundingClientRect();
  const left = linkRect.left - navRect.left;

  navElement.style.setProperty("--nav-line-left", `${left}px`);
  navElement.style.setProperty("--nav-line-width", `${linkRect.width}px`);
}

function initNavScrollSurface() {
  if (!navElement) {
    return;
  }

  navScrollHandler = () => {
    navElement.classList.toggle("is-scrolled", window.scrollY > 48);
  };

  navScrollHandler();
  window.addEventListener("scroll", navScrollHandler, { passive: true });
}

function initNavMagneticHover() {
  if (!navElement || !navLinks.length) {
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

  cleanupMagneticHandlers = [];

  navLinks.forEach((link) => {
    const moveHandler = (event) => {
      const rect = link.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;

      const strength = 3.2;
      const moveX = ((localX / rect.width) * 2 - 1) * strength;
      const moveY = ((localY / rect.height) * 2 - 1) * (strength * 0.7) - 1;

      link.style.setProperty("--mx", `${moveX.toFixed(2)}px`);
      link.style.setProperty("--my", `${moveY.toFixed(2)}px`);
    };

    const resetHandler = () => {
      link.style.setProperty("--mx", "0px");
      link.style.setProperty("--my", "0px");
    };

    link.addEventListener("mousemove", moveHandler);
    link.addEventListener("mouseleave", resetHandler);
    link.addEventListener("blur", resetHandler);

    cleanupMagneticHandlers.push(() => {
      link.removeEventListener("mousemove", moveHandler);
      link.removeEventListener("mouseleave", resetHandler);
      link.removeEventListener("blur", resetHandler);
      resetHandler();
    });
  });
}

export function initializeMainNav() {
  disposeMainNav();

  navElement = document.querySelector(".main-nav");
  if (!navElement) {
    return;
  }

  navLinks = Array.from(navElement.querySelectorAll(".nav-link:not(.nav-lang)"));
  if (!navLinks.length) {
    return;
  }

  window.updateNavLine = placeLine;

  placeLine(getActiveLink());

  cleanupLinkHandlers = [];
  navLinks.forEach((link) => {
    const mouseEnterHandler = () => placeLine(link);
    const focusHandler = () => placeLine(link);

    link.addEventListener("mouseenter", mouseEnterHandler);
    link.addEventListener("focus", focusHandler);

    cleanupLinkHandlers.push(() => {
      link.removeEventListener("mouseenter", mouseEnterHandler);
      link.removeEventListener("focus", focusHandler);
    });
  });

  mouseLeaveHandler = () => placeLine(getActiveLink());
  focusOutHandler = (event) => {
    if (!navElement.contains(event.relatedTarget)) {
      placeLine(getActiveLink());
    }
  };
  resizeHandler = () => placeLine(getActiveLink());

  navElement.addEventListener("mouseleave", mouseLeaveHandler);
  navElement.addEventListener("focusout", focusOutHandler);
  window.addEventListener("resize", resizeHandler);

  initNavScrollSurface();
  initNavMagneticHover();
}

export function disposeMainNav() {
  cleanupLinkHandlers.forEach((cleanup) => cleanup());
  cleanupLinkHandlers = [];

  cleanupMagneticHandlers.forEach((cleanup) => cleanup());
  cleanupMagneticHandlers = [];

  if (navElement && mouseLeaveHandler) {
    navElement.removeEventListener("mouseleave", mouseLeaveHandler);
  }

  if (navElement && focusOutHandler) {
    navElement.removeEventListener("focusout", focusOutHandler);
  }

  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
  }

  if (navScrollHandler) {
    window.removeEventListener("scroll", navScrollHandler);
  }

  if (window.updateNavLine === placeLine) {
    delete window.updateNavLine;
  }

  navElement = undefined;
  navLinks = [];
  resizeHandler = undefined;
  mouseLeaveHandler = undefined;
  focusOutHandler = undefined;
  navScrollHandler = undefined;
}

function bootMainNav() {
  const nav = document.querySelector(".main-nav");
  if (!nav) {
    disposeMainNav();
    return;
  }

  if (nav === navElement && cleanupLinkHandlers.length) {
    placeLine(getActiveLink());
    return;
  }

  initializeMainNav();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootMainNav);
} else {
  bootMainNav();
}

window.Blazor?.addEventListener("enhancedload", bootMainNav);
