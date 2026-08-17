/* =========================================================
   MATRICE DEL DESTINO - script.js
   ========================================================= */

// Coordinate dei cerchi visibili nell'immagine (viewBox 1000x1000).
// Se necessario puoi rifinire qualche coordinata di pochi pixel.
const CERCHI = {
  eta0: { x: 105, y: 518, fontSize: 40 }, //ok
  eta10: { x: 215, y: 245, fontSize: 40 }, //ok
  eta20: { x: 490, y: 135, fontSize: 40 }, //ok
  eta30: { x: 755, y: 245, fontSize: 40 }, //ok
  eta40: { x: 870, y: 518, fontSize: 40 }, //ok
  eta50: { x: 755, y: 790, fontSize: 40 }, //ok
  eta60: { x: 490, y: 900, fontSize: 40 }, //ok
  eta70: { x: 220, y: 790, fontSize: 40 }, //ok

  centro: { x: 488, y: 518, fontSize: 50 }, //ok

  top1: { x: 490, y: 210, fontSize: 30 }, //ok
  top2: { x: 490, y: 265, fontSize: 20 }, //ok
  top3: { x: 490, y: 368, fontSize: 20 }, //ok

  left1: { x: 175, y: 518, fontSize: 30 }, //ok
  left2: { x: 230, y: 518, fontSize: 20 }, //ok
  left3: { x: 335, y: 518, fontSize: 20 }, //ok

  right1: { x: 745, y: 518, fontSize: 20 }, //ok
  right2: { x: 795, y: 518, fontSize: 30 }, //ok
  right3: { x: 565, y: 518, fontSize: 30 },
  right4: { x: 620, y: 518, fontSize: 20 },

  bottom1: { x: 490, y: 775, fontSize: 20 }, //ok
  bottom2: { x: 490, y: 830, fontSize: 30 }, //ok

  upLeft1: { x: 270, y: 300, fontSize: 30 }, //ok
  upLeft2: { x: 305, y: 340, fontSize: 20 }, //ok
  upRight1: { x: 705, y: 300, fontSize: 30 }, //ok
  upRight2: { x: 670, y: 340, fontSize: 20 }, //ok

  downLeft2: { x: 305, y: 705, fontSize: 20 }, //ok
  downLeft3: { x: 270, y: 740, fontSize: 30 }, //ok

  downRight1: { x: 665, y: 700, fontSize: 20 },
  downRight2: { x: 705, y: 735, fontSize: 30 },

  moneyLove1: { x: 608, y: 638, fontSize: 20 }, // ok
  moneyLove2: { x: 668, y: 625, fontSize: 20 }, // ok
  moneyLove3: { x: 588, y: 702, fontSize: 20 }, //ok

  leftSide1: { x: 230, y: 665, fontSize: 20 }, //ok
  leftSide2: { x: 230, y: 700, fontSize: 20 }, //ok
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

const MOSTRA_MAPPA_GUIDA = false;
const INCLUDE_GUIDA_NELL_EXPORT = false;

function calcolaPosizionePrognosiSegmento(fromKey, toKey, indice) {
  const from = CERCHI[fromKey];
  const to = CERCHI[toKey];
  const centro = CERCHI.centro;

  if (!from || !to || !centro) {
    return null;
  }

  const t = (indice + 1) / (PROGNOSI_PERIODI.length + 1);
  const baseX = from.x + (to.x - from.x) * t;
  const baseY = from.y + (to.y - from.y) * t;
  const vecX = baseX - centro.x;
  const vecY = baseY - centro.y;
  const modulo = Math.hypot(vecX, vecY) || 1;

  // Offset esterno maggiore per evitare sovrapposizioni con la matrice interna.
  const offset = 52;
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

  const bbox = textEl.getBBox();
  const currentCenterX = bbox.x + bbox.width / 2;
  const currentCenterY = bbox.y + bbox.height / 2;

  const shiftX = targetX - currentCenterX;
  const shiftY = targetY - currentCenterY;

  const currentX = Number(textEl.getAttribute("x")) || 0;
  const currentY = Number(textEl.getAttribute("y")) || 0;

  textEl.setAttribute("x", String(currentX + shiftX));
  textEl.setAttribute("y", String(currentY + shiftY));
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
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Impossibile leggere l'immagine di sfondo per l'export.");
  }

  const blob = await response.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Errore conversione immagine."));
    reader.readAsDataURL(blob);
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
  const nome = (inputNome.value || "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
  const data = inputData.value || "senza-data";

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

const btnCalcola = document.getElementById("btnCalcola");
const btnExport = document.getElementById("btnExport");
const inputNome = document.getElementById("nome");
const inputData = document.getElementById("dataNascita");
const erroreEl = document.getElementById("errore");
const matrixPanelEl = document.querySelector(".matrix-panel");
const matrixContainerEl = document.querySelector(".matrix-container");

if (btnExport) {
  btnExport.disabled = true;
}

function mostraMappaAnimata() {
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

if (btnCalcola && btnExport && inputNome && inputData && erroreEl) {
  btnCalcola.addEventListener("click", () => {
    const nome = inputNome.value.trim();
    const data = inputData.value;

    erroreEl.hidden = true;

    if (!nome || !data) {
      erroreEl.textContent = "Inserisci nome e data di nascita.";
      erroreEl.hidden = false;
      return;
    }

    const risultati = calcolaMatrice(nome, data);
    disegnaMatrice(risultati);
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

inizializzaPosizioniPrognosi();
disegnaMappaGuida();
initUiMotion();
initNavIndicator();
initNavMagneticHover();
initBackToTop();
