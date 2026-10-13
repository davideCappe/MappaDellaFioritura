namespace MDF.Services;

public sealed class ClienteStorageService(IWebHostEnvironment environment)
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg",
        ".pdf",
        ".mp3", ".wav", ".ogg", ".m4a"
    };

    private readonly string rootPath = Path.Combine(environment.ContentRootPath, "App_Data", "Clienti");

    public string GetClienteFolder(Guid publicId)
        => Path.Combine(rootPath, publicId.ToString("D"));

    public string GetPublicRoute(Guid publicId)
        => $"/cliente/{publicId:D}";

    public IReadOnlyList<ClienteStoredFile> GetFiles(Guid publicId)
    {
        var folder = GetClienteFolder(publicId);

        if (!Directory.Exists(folder))
        {
            return [];
        }

        return Directory.EnumerateFiles(folder)
            .Select(path => new FileInfo(path))
            .OrderByDescending(file => file.LastWriteTimeUtc)
            .Select(file => new ClienteStoredFile(file.Name, file.Length, file.LastWriteTimeUtc))
            .ToList();
    }

    public async Task SaveFileAsync(Guid publicId, string originalFileName, Stream content, CancellationToken cancellationToken = default)
    {
        var safeFileName = SanitizeFileName(originalFileName);
        ValidateExtension(safeFileName);

        var folder = GetClienteFolder(publicId);
        Directory.CreateDirectory(folder);

        var filePath = Path.Combine(folder, safeFileName);

        await using var target = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None);
        await content.CopyToAsync(target, cancellationToken);
    }

    public void DeleteFile(Guid publicId, string fileName)
    {
        var safeFileName = SanitizeFileName(fileName);
        var filePath = Path.Combine(GetClienteFolder(publicId), safeFileName);

        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
    }

    public void DeleteClienteFolder(Guid publicId)
    {
        var folder = GetClienteFolder(publicId);

        if (Directory.Exists(folder))
        {
            Directory.Delete(folder, recursive: true);
        }
    }

    private static void ValidateExtension(string fileName)
    {
        var extension = Path.GetExtension(fileName);

        if (string.IsNullOrWhiteSpace(extension) || !AllowedExtensions.Contains(extension))
        {
            throw new InvalidOperationException("Estensione file non consentita.");
        }
    }

    private static string SanitizeFileName(string fileName)
    {
        var safeFileName = Path.GetFileName(fileName).Trim();

        if (string.IsNullOrWhiteSpace(safeFileName))
        {
            throw new InvalidOperationException("Nome file non valido.");
        }

        foreach (var invalidChar in Path.GetInvalidFileNameChars())
        {
            safeFileName = safeFileName.Replace(invalidChar, '_');
        }

        return safeFileName;
    }
}

public sealed record ClienteStoredFile(string Name, long Size, DateTime LastWriteUtc);
