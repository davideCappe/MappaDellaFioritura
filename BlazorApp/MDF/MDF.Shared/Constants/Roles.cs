namespace MDF.Shared.Constants;

public static class Roles
{
    public const string SuperAdmin = "SuperAdmin";
    public const string Admin = "Admin";
    public const string User = "User";

    /// <summary>
    /// Gets an array containing all defined user roles in the system.
    /// </summary>
    public static readonly string[] AllRoles = [SuperAdmin, Admin, User];
}
