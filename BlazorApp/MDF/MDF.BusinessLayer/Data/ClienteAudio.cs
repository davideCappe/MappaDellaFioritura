using System.ComponentModel.DataAnnotations;

namespace MDF.BusinessLayer.Data;

public class ClienteAudio
{
    public int Id { get; set; }

    public int ClienteId { get; set; }

    [Required]
    [StringLength(260)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    [StringLength(160)]
    public string Titolo { get; set; } = string.Empty;

    public int Ordine { get; set; }

    public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedUtc { get; set; }

    public Cliente Cliente { get; set; } = default!;
}
