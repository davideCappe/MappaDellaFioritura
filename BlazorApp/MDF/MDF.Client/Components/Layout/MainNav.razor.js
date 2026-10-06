let navElement;
let navLinks = [];
let resizeHandler;
let mouseLeaveHandler;
let focusOutHandler;
let cleanupLinkHandlers = [];

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

export function initializeMainNav() {
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
}

export function disposeMainNav() {
  cleanupLinkHandlers.forEach((cleanup) => cleanup());
  cleanupLinkHandlers = [];

  if (navElement && mouseLeaveHandler) {
    navElement.removeEventListener("mouseleave", mouseLeaveHandler);
  }

  if (navElement && focusOutHandler) {
    navElement.removeEventListener("focusout", focusOutHandler);
  }

  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
  }

  if (window.updateNavLine === placeLine) {
    delete window.updateNavLine;
  }

  navElement = undefined;
  navLinks = [];
  resizeHandler = undefined;
  mouseLeaveHandler = undefined;
  focusOutHandler = undefined;
}
