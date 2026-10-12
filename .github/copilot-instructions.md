# Copilot Instructions

## Linee guida del progetto
- Per questo repository l'utente preferisce centralizzare gli stili condivisi in `MDF/wwwroot/app.css` e mantenere la CSS isolation (`.razor.css`) per componenti layout come menu e footer.
- Quando chiede di sistemare JS tra file, preferisce spostare/ricollocare la logica nel componente corretto invece di rimuoverla.
- Salvare i file (audio/pdf) su disco in cartelle nominate con il GUID pubblico cliente, con routing pagina su /cliente/{publicId} per recupero contenuti.

## Preferenze UI
- Schermata login molto semplice con soli campi email/password, checkbox "ricordami", pulsante "accedi" e opzione passkey; niente registrazione utente e niente login con provider esterni.