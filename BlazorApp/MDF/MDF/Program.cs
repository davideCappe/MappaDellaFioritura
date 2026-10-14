using MDF;
using MDF.BusinessLayer.Data;
using MDF.BusinessLayer.Settings;
using MDF.Components;
using MDF.Components.Account;
using MDF.Services;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TinyHelpers.AspNetCore.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents()
    .AddInteractiveWebAssemblyComponents()
    .AddAuthenticationStateSerialization();

// Settings section
var superAdminSettings = builder.Services.ConfigureAndGet<SuperAdminSettings>(builder.Configuration, nameof(SuperAdminSettings)) ?? new();

builder.Services.AddCascadingAuthenticationState();
builder.Services.AddScoped<IdentityRedirectManager>();
builder.Services.AddScoped<AuthenticationStateProvider, IdentityRevalidatingAuthenticationStateProvider>();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultScheme = IdentityConstants.ApplicationScheme;
        options.DefaultSignInScheme = IdentityConstants.ExternalScheme;
    })
    .AddIdentityCookies();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
void configureDb(DbContextOptionsBuilder options) =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        // Abilita la resilienza automatica per errori SQL transienti
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(3),
            errorNumbersToAdd: null);
    });

builder.Services.AddDbContextFactory<ApplicationDbContext>(configureDb);
builder.Services.AddScoped(sp =>
    sp.GetRequiredService<IDbContextFactory<ApplicationDbContext>>().CreateDbContext());
builder.Services.AddScoped<ClienteStorageService>();
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddIdentityCore<ApplicationUser>(options =>
    {
        options.SignIn.RequireConfirmedAccount = true;
        options.Stores.SchemaVersion = IdentitySchemaVersions.Version3;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddSignInManager()
    .AddDefaultTokenProviders();

builder.Services.AddSingleton<IEmailSender<ApplicationUser>, IdentityNoOpEmailSender>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
    app.UseWebAssemblyDebugging();
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// Initialize the database
await DatabaseInitializer.InitializeAsync(app.Services);

app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);

// Inseriti inizialmente per consentire l'accesso a file statici come immagini, CSS e JavaScript. 
//app.UseDefaultFiles();
//app.UseStaticFiles();
app.UseAntiforgery();

app.MapStaticAssets();
app.MapGet("/cliente/{publicId:guid}/files/{fileName}", async (Guid publicId, string fileName, IDbContextFactory<ApplicationDbContext> dbContextFactory, ClienteStorageService storageService) =>
{
    var decodedFileName = Uri.UnescapeDataString(fileName);

    await using var dbContext = await dbContextFactory.CreateDbContextAsync();
    var cliente = await dbContext.Clienti
        .Include(x => x.AudioTracks)
        .FirstOrDefaultAsync(x => x.PublicId == publicId && x.IsAttivo);

    if (cliente is null)
    {
        return (IResult)Results.NotFound();
    }

    var isAllowedFile = string.Equals(cliente.PdfFileName, decodedFileName, StringComparison.OrdinalIgnoreCase)
        || cliente.AudioTracks.Any(x => string.Equals(x.FileName, decodedFileName, StringComparison.OrdinalIgnoreCase));

    if (!isAllowedFile || !storageService.FileExists(publicId, decodedFileName))
    {
        return (IResult)Results.NotFound();
    }

    var filePath = storageService.GetClienteFilePath(publicId, decodedFileName);
    var contentType = storageService.GetContentType(decodedFileName);

    return (IResult)Results.File(filePath, contentType, enableRangeProcessing: true);
});

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode()
    .AddInteractiveWebAssemblyRenderMode()
    .AddAdditionalAssemblies(typeof(MDF.Client._Imports).Assembly);

// Add additional endpoints required by the Identity /Account Razor components.
app.MapAdditionalIdentityEndpoints();

app.Run();
