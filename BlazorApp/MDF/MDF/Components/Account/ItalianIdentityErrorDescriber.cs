using Microsoft.AspNetCore.Identity;

namespace MDF.Components.Account;

internal sealed class ItalianIdentityErrorDescriber : IdentityErrorDescriber
{
    public override IdentityError DefaultError()
        => Error(nameof(DefaultError), "Si e verificato un errore. Riprova.");

    public override IdentityError ConcurrencyFailure()
        => Error(nameof(ConcurrencyFailure), "I dati sono stati modificati da un'altra operazione. Ricarica la pagina e riprova.");

    public override IdentityError PasswordMismatch()
        => Error(nameof(PasswordMismatch), "La password attuale non e corretta.");

    public override IdentityError InvalidToken()
        => Error(nameof(InvalidToken), "Il codice non e valido o e scaduto. Richiedine uno nuovo.");

    public override IdentityError RecoveryCodeRedemptionFailed()
        => Error(nameof(RecoveryCodeRedemptionFailed), "Il codice di recupero non e valido o e gia stato utilizzato.");

    public override IdentityError LoginAlreadyAssociated()
        => Error(nameof(LoginAlreadyAssociated), "Questo accesso esterno e gia collegato a un altro account.");

    public override IdentityError InvalidUserName(string? userName)
        => Error(nameof(InvalidUserName), "Il nome utente contiene caratteri non consentiti.");

    public override IdentityError InvalidEmail(string? email)
        => Error(nameof(InvalidEmail), "L'indirizzo email non e valido.");

    public override IdentityError DuplicateUserName(string userName)
        => Error(nameof(DuplicateUserName), "Il nome utente e gia utilizzato da un altro account.");

    public override IdentityError DuplicateEmail(string email)
        => Error(nameof(DuplicateEmail), "L'indirizzo email e gia utilizzato da un altro account.");

    public override IdentityError InvalidRoleName(string? role)
        => Error(nameof(InvalidRoleName), "Il nome del ruolo non e valido.");

    public override IdentityError DuplicateRoleName(string role)
        => Error(nameof(DuplicateRoleName), "Esiste gia un ruolo con questo nome.");

    public override IdentityError UserAlreadyHasPassword()
        => Error(nameof(UserAlreadyHasPassword), "L'account ha gia una password.");

    public override IdentityError UserLockoutNotEnabled()
        => Error(nameof(UserLockoutNotEnabled), "Il blocco dell'accesso non e abilitato per questo account.");

    public override IdentityError UserAlreadyInRole(string role)
        => Error(nameof(UserAlreadyInRole), "L'utente ha gia il ruolo selezionato.");

    public override IdentityError UserNotInRole(string role)
        => Error(nameof(UserNotInRole), "L'utente non ha il ruolo selezionato.");

    public override IdentityError PasswordTooShort(int length)
        => Error(nameof(PasswordTooShort), $"La password deve contenere almeno {length} caratteri.");

    public override IdentityError PasswordRequiresUniqueChars(int uniqueChars)
        => Error(nameof(PasswordRequiresUniqueChars), $"La password deve contenere almeno {uniqueChars} caratteri distinti.");

    public override IdentityError PasswordRequiresNonAlphanumeric()
        => Error(nameof(PasswordRequiresNonAlphanumeric), "La password deve contenere almeno un carattere speciale.");

    public override IdentityError PasswordRequiresDigit()
        => Error(nameof(PasswordRequiresDigit), "La password deve contenere almeno un numero.");

    public override IdentityError PasswordRequiresLower()
        => Error(nameof(PasswordRequiresLower), "La password deve contenere almeno una lettera minuscola.");

    public override IdentityError PasswordRequiresUpper()
        => Error(nameof(PasswordRequiresUpper), "La password deve contenere almeno una lettera maiuscola.");

    private static IdentityError Error(string code, string description)
        => new() { Code = code, Description = description };
}
