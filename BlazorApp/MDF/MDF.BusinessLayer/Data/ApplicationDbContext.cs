using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MDF.BusinessLayer.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<Cliente> Clienti => Set<Cliente>();

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

            entity.Property(x => x.IsAttivo)
                .HasDefaultValue(true);

            entity.Property(x => x.CreatedUtc)
                .IsRequired();

            entity.HasIndex(x => x.PublicId)
                .IsUnique();

            entity.HasIndex(x => x.Nome);
        });
    }
}
