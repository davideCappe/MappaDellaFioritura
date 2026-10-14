using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MDF.BusinessLayer.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<Cliente> Clienti => Set<Cliente>();
    public DbSet<ClienteAudio> ClienteAudioTracks => Set<ClienteAudio>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Cliente>(entity =>
        {
            entity.ToTable("Clienti");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Nome)
                .HasMaxLength(160)
                .IsRequired();

            entity.Property(x => x.PublicId)
                .IsRequired();

            entity.Property(x => x.PdfFileName)
                .HasMaxLength(260);

            entity.Property(x => x.IsAttivo)
                .HasDefaultValue(true);

            entity.Property(x => x.CreatedUtc)
                .IsRequired();

            entity.HasIndex(x => x.PublicId)
                .IsUnique();

            entity.HasIndex(x => x.Nome);

            entity.HasMany(x => x.AudioTracks)
                .WithOne(x => x.Cliente)
                .HasForeignKey(x => x.ClienteId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<ClienteAudio>(entity =>
        {
            entity.ToTable("ClienteAudioTracks");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.FileName)
                .HasMaxLength(260)
                .IsRequired();

            entity.Property(x => x.Titolo)
                .HasMaxLength(160)
                .IsRequired();

            entity.Property(x => x.Ordine)
                .IsRequired();

            entity.Property(x => x.CreatedUtc)
                .IsRequired();

            entity.HasIndex(x => new { x.ClienteId, x.Ordine });
            entity.HasIndex(x => new { x.ClienteId, x.FileName }).IsUnique();
        });
    }
}
