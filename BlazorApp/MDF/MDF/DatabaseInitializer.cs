using MDF.BusinessLayer.Data;
using MDF.BusinessLayer.Settings;
using MDF.Shared.Constants;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace MDF;

public class DatabaseInitializer
{
    private static ILogger<DatabaseInitializer>? logger;
    private static RoleManager<IdentityRole>? roleManager;
    private static UserManager<ApplicationUser>? userManager;
    /// <summary>
    /// Initializes the database by applying migrations and seeding initial data.
    /// </summary>
    /// <param name="serviceProvider"></param>
    /// <returns></returns>
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        ArgumentNullException.ThrowIfNull(serviceProvider, nameof(serviceProvider));

        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        logger = scope.ServiceProvider.GetRequiredService<ILogger<DatabaseInitializer>>();
        roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var superAdminSettings = scope.ServiceProvider.GetRequiredService<IOptions<SuperAdminSettings>>().Value;

        ArgumentNullException.ThrowIfNull(superAdminSettings.UserName);
        ArgumentNullException.ThrowIfNull(superAdminSettings.Email);
        ArgumentNullException.ThrowIfNull(superAdminSettings.Password);

        logger.LogInformation("Starting database initialization...");

        try
        {
            // Apply any pending migrations
            logger.LogDebug("Applying pending migrations...");
            await dbContext.Database.MigrateAsync().ConfigureAwait(false);
            logger.LogDebug("Database migrations applied successfully.");
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "An error occurred while applying database migrations.");
            throw;
        }

        // Seed the database with initial data if necessary
        await SeedDataAsync(dbContext, superAdminSettings);
    }

    // L'idea del metodo è verificare se esistono i ruoli e l'utente superAdmin, se non esistono li crea. In questo modo, quando l'applicazione viene avviata per la prima volta, il database sarà popolato con i dati iniziali necessari per il funzionamento dell'applicazione.

    private static async Task SeedDataAsync(ApplicationDbContext dbContext, SuperAdminSettings superAdminSettings)
    {
        var roles = Roles.AllRoles;

        // Check if roles exist, if not create them using roleManager
        logger!.LogDebug("Checking for existing roles...");
        foreach (var role in roles)
        {
            if (!await roleManager!.RoleExistsAsync(role).ConfigureAwait(false))
            {
                logger!.LogDebug("Role '{role}' does not exist. Creating...", role);
                var roleEntity = new IdentityRole(role);
                await roleManager.CreateAsync(roleEntity).ConfigureAwait(false);
            }
        }

        // Create a superAdmin user if it doesn't exist
        var superAdminUser = await userManager!.FindByNameAsync(superAdminSettings.UserName).ConfigureAwait(false);

        if (superAdminUser is null)
        {
            logger!.LogDebug("SuperAdmin user does not exist. Creating...");
            superAdminUser = new ApplicationUser
            {
                UserName = superAdminSettings.UserName,
                Email = superAdminSettings.Email,
                EmailConfirmed = true
            };

            var createdUserResult = await userManager.CreateAsync(superAdminUser, superAdminSettings.Password).ConfigureAwait(false);
            if (!createdUserResult.Succeeded)
            {
                var errorMessage = string.Join(", ", createdUserResult.Errors.Select(e => e.Description));
                logger!.LogCritical("Failed to create SuperAdmin user: {errors}", errorMessage);
                throw new Exception(errorMessage);
            }
        }
        else
        {
            logger!.LogDebug("SuperAdmin user already exists.");
        }

        // Assign the SuperAdmin role to the superAdmin user
        if (!await userManager.IsInRoleAsync(superAdminUser, Roles.SuperAdmin).ConfigureAwait(false))
        {
            logger!.LogDebug("Assigning SuperAdmin role to the superAdmin user...");
            var addToRoleResult = await userManager.AddToRoleAsync(superAdminUser, Roles.SuperAdmin).ConfigureAwait(false);
            if (!addToRoleResult.Succeeded)
            {
                var errorMessage = string.Join(", ", addToRoleResult.Errors.Select(e => e.Description));
                logger!.LogCritical("Failed to assign SuperAdmin role to superAdmin user: {errors}", errorMessage);
                throw new Exception(errorMessage);
            }
        }
        else
        {
            logger!.LogDebug("SuperAdmin user already has the SuperAdmin role.");
        }
    }
}