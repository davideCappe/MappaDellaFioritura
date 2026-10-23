# Copilot Instructions

## Linee guida del progetto
- Per questo repository l'utente preferisce centralizzare gli stili condivisi in `MDF/wwwroot/app.css` e mantenere la CSS isolation (`.razor.css`) per componenti e pagine specifiche. Gli stili specifici dei componenti/pagine devono essere gestiti tramite CSS isolation, mentre `wwwroot/app.css` deve contenere solo stili condivisi/globali.
- Quando chiede di sistemare JS tra file, preferisce spostare/ricollocare la logica nel componente corretto invece di rimuoverla.
- Salvare i file (audio/pdf) su disco in cartelle nominate con il GUID pubblico cliente, con routing pagina su /cliente/{publicId} per recupero contenuti. Ogni cliente avrà una pagina pubblica raggiungibile con route /cliente/{publicId}, e i contenuti statici saranno letti da una sottocartella nominata con il GUID pubblico del cliente. Un mapping nome cliente <-> GUID può essere salvato in SQL Server tramite ApplicationDbContext.
- Per la futura pagina pubblica cliente del progetto Blazor, l'utente vuole un risultato finale simile al campione statico in wwwroot/deleteMe/pagina-cliente.html, pagina-cliente.css e pagina-cliente.js, adattato all'architettura Blazor e al caricamento dinamico dei contenuti cliente. La cliente caricherà un PDF e un numero variabile di tracce audio. Per ogni traccia audio va salvato un titolo da mostrare nella pagina cliente e un ordinamento esplicito per visualizzarle nell'ordine stabilito. La sezione immagini va ignorata per ora.
- I servizi con dipendenze infrastrutturali/web (es. IWebHostEnvironment, file system come ClienteStorageService) non devono stare nel progetto BusinessLayer.

## Preferenze UI
- Schermata login molto semplice con soli campi email/password, checkbox "ricordami", pulsante "accedi" e opzione passkey; niente registrazione utente e niente login con provider esterni.

## Funzionalità Admin
- Consentire a utenti con ruolo almeno Admin di creare, modificare ed eliminare clienti e relativi file statici.