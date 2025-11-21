using Incapacidades.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Incapacidades.Infrastructure.Persistence;

public class IncapacidadesDbContext : DbContext
{
    public IncapacidadesDbContext(DbContextOptions<IncapacidadesDbContext> options)
        : base(options)
    {
    }

    public DbSet<Incapacidad> Incapacidades => Set<Incapacidad>();
    public DbSet<Documento> Documentos => Set<Documento>();
    public DbSet<Empleado> Empleados => Set<Empleado>();
    public DbSet<TranscripcionEPS> Transcripciones => Set<TranscripcionEPS>();
    public DbSet<PagoEPS> Pagos => Set<PagoEPS>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(IncapacidadesDbContext).Assembly);
    }
}

