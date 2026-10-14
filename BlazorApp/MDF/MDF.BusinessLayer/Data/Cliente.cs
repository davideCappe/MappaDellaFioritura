using System.ComponentModel.DataAnnotations;

namespace MDF.BusinessLayer.Data;

public class Cliente
{
    public int Id { get; set; }

    [Required]
    [StringLength(160)]
    public string Nome { get; set; } = string.Empty;

    public Guid PublicId { get; set; } = Guid.NewGuid();

    [StringLength(260)]
    public string? PdfFileName { get; set; }

    public bool IsAttivo { get; set; } = true;

    public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedUtc { get; set; }

    public ICollection<ClienteAudio> AudioTracks { get; set; } = [];
}
