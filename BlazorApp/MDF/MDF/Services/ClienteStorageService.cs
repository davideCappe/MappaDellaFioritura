using Microsoft.AspNetCore.StaticFiles;

namespace MDF.Services;

public sealed class ClienteStorageService(IWebHostEnvironment environment)
{
    private static readonly HashSet<string> AllowedPdfExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".pdf"
    };

    private static readonly HashSet<string> AllowedAudioExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".mp3", ".wav", ".ogg", ".m4a"
    };

    private static readonly HashSet<string> AllowedExtensions = [.. AllowedPdfExtensions, .. AllowedAudioExtensions];
    private static readonly FileExtensionContentTypeProvider ContentTypeProvider = new();
    private readonly string rootPath = Path.Combine(environment.ContentRootPath, "App_Data", "Clienti");

    public string GetClienteFolder(Guid publicId)
        => Path.Combine(rootPath, publicId.ToString("D"));

    public string GetPublicRoute(Guid publicId)
        => $"/cliente/{publicId:D}";

    public string GetPublicFileRoute(Guid publicId, string fileName)
        => $"/cliente/{publicId:D}/files/{Uri.EscapeDataString(SanitizeFileName(fileName))}";

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

    public async Task<string> SavePdfAsync(Guid publicId, string originalFileName, Stream content, CancellationToken cancellationToken = default)
        => await SaveFileInternalAsync(publicId, originalFileName, content, AllowedPdfExtensions, cancellationToken);

    public async Task<string> SaveAudioAsync(Guid publicId, string originalFileName, Stream content, CancellationToken cancellationToken = default)
        => await SaveFileInternalAsync(publicId, originalFileName, content, AllowedAudioExtensions, cancellationToken);

    public bool FileExists(Guid publicId, string fileName)
        => File.Exists(GetClienteFilePath(publicId, fileName));

    public string GetClienteFilePath(Guid publicId, string fileName)
    {
        var safeFileName = SanitizeFileName(fileName);
        return Path.Combine(GetClienteFolder(publicId), safeFileName);
    }

    public string GetContentType(string fileName)
    {
        var safeFileName = SanitizeFileName(fileName);

        return ContentTypeProvider.TryGetContentType(safeFileName, out var contentType)
            ? contentType
            : "application/octet-stream";
    }

    public void DeleteFile(Guid publicId, string fileName)
    {
        var filePath = GetClienteFilePath(publicId, fileName);

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

    private async Task<string> SaveFileInternalAsync(Guid publicId, string originalFileName, Stream content, HashSet<string> allowedExtensions, CancellationToken cancellationToken)
    {
        var safeFileName = SanitizeFileName(originalFileName);
        ValidateExtension(safeFileName, allowedExtensions);

        var folder = GetClienteFolder(publicId);
        Directory.CreateDirectory(folder);

        var filePath = Path.Combine(folder, safeFileName);

        await using var target = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None);
        await content.CopyToAsync(target, cancellationToken);

        return safeFileName;
    }

    private static void ValidateExtension(string fileName, HashSet<string>? allowedExtensions = null)
    {
        var extension = Path.GetExtension(fileName);
        var candidates = allowedExtensions ?? AllowedExtensions;

        if (string.IsNullOrWhiteSpace(extension) || !candidates.Contains(extension))
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
