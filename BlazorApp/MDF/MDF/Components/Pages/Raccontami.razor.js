function initRaccontamiPage() {
  const isEnglish = document.documentElement.lang === "en";
  const form = document.getElementById("story-form");
  const name = document.getElementById("story-name");
  const email = document.getElementById("story-email");
  const message = document.getElementById("story-message");
  const count = document.getElementById("story-count");
  const submit = document.getElementById("story-submit");
  const clear = document.getElementById("story-clear");
  const status = document.getElementById("story-status");
  if (!form || !name || !email || !message || !count || !submit || !clear || !status) return;

  const updateWritingState = () => {
    const length = message.value.length;
    count.textContent = `${new Intl.NumberFormat(isEnglish ? "en-US" : "it-IT").format(length)} / ${isEnglish ? "2,400" : "2.400"}`;
    submit.disabled = !message.value.trim();
  };

  message.addEventListener("input", updateWritingState);

  document.querySelectorAll("[data-writing-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      const prompt = button.dataset.writingPrompt;
      const currentText = message.value.trimEnd();
      message.value = currentText ? `${currentText}\n\n${prompt} ` : `${prompt} `;
      message.focus();
      message.setSelectionRange(message.value.length, message.value.length);
      updateWritingState();
    });
  });

  clear.addEventListener("click", () => {
    const confirmMessage = isEnglish
      ? "Do you want to clear the text you have written?"
      : "Vuoi svuotare il testo che hai scritto?";
    if (!message.value || !window.confirm(confirmMessage)) return;
    message.value = "";
    status.textContent = "";
    updateWritingState();
    message.focus();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = message.value.trim();
    if (!content) {
      message.reportValidity();
      return;
    }

    const subject = encodeURIComponent(isEnglish ? "A message from A Breath in Bloom" : "Un messaggio da Un Respiro che Fiorisce");
    const body = encodeURIComponent(`${isEnglish ? "Name" : "Nome"}: ${name.value.trim()}\n${isEnglish ? "Email" : "E-mail"}: ${email.value.trim()}\n\n${content}`);
    status.textContent = isEnglish
      ? "Your email program will open: you can review the text and choose whether to send it."
      : "Si aprirà il tuo programma di posta: potrai rileggere il testo e scegliere se inviarlo.";
    window.location.href = `mailto:silvia@mappadellafioritura.it?subject=${subject}&body=${body}`;
  });

  updateWritingState();
}

function bootRaccontamiPage() {
  const form = document.getElementById("story-form");
  if (!form) {
    return;
  }

  if (form.dataset.init === "1") {
    return;
  }

  form.dataset.init = "1";
  initRaccontamiPage();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootRaccontamiPage);
} else {
  bootRaccontamiPage();
}

window.Blazor?.addEventListener("enhancedload", bootRaccontamiPage);
