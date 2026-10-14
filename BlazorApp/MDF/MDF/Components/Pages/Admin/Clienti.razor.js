function initAdminClientiPage() {
  const root = document.querySelector(".admin-clienti-page");
  if (!root || root.dataset.init === "1") {
    return;
  }

  root.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy-public-url]");
    if (!button) {
      return;
    }

    const url = button.dataset.copyPublicUrl;
    if (!url) {
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      const defaultLabel = button.dataset.copyLabelDefault || "Copia link";
      const successLabel = button.dataset.copyLabelSuccess || "Link copiato";

      button.textContent = successLabel;
      button.dataset.copyState = "success";

      window.setTimeout(() => {
        button.textContent = defaultLabel;
        button.dataset.copyState = "";
      }, 1400);
    } catch {
      button.textContent = "Copia non disponibile";
      window.setTimeout(() => {
        button.textContent = button.dataset.copyLabelDefault || "Copia link";
      }, 1600);
    }
  });

  root.dataset.init = "1";
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAdminClientiPage, { once: true });
} else {
  initAdminClientiPage();
}

document.addEventListener("enhancedload", initAdminClientiPage);
