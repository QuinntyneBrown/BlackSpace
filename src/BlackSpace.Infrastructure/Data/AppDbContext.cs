using BlackSpace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BlackSpace.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Member> Members => Set<Member>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Member>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.Property(m => m.FullName).IsRequired().HasMaxLength(200);
            entity.Property(m => m.Email).IsRequired().HasMaxLength(320);
            entity.HasIndex(m => m.Email).IsUnique();
            entity.Property(m => m.RoleTitle).HasMaxLength(200);
            entity.Property(m => m.Organization).HasMaxLength(200);
            entity.Property(m => m.ReferralSource).HasMaxLength(500);
            entity.Property(m => m.IpAddress).HasMaxLength(45);
        });
    }
}
