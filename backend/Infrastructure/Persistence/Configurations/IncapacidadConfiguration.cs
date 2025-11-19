using Incapacidades.Domain.Entities;
using Incapacidades.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Incapacidades.Infrastructure.Persistence.Configurations;

public class IncapacidadConfiguration : IEntityTypeConfiguration<Incapacidad>
{
    public void Configure(EntityTypeBuilder<Incapacidad> builder)
    {
        builder.ToTable("incapacidades");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(i => i.EmpleadoId)
            .HasColumnName("empleado_id")
            .IsRequired();

        builder.Property(i => i.Tipo)
            .HasColumnName("tipo")
            .HasConversion<string>()
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(i => i.FechaInicio)
            .HasColumnName("fecha_inicio")
            .IsRequired();

        builder.Property(i => i.FechaFin)
            .HasColumnName("fecha_fin")
            .IsRequired();

        builder.Property(i => i.Diagnostico)
            .HasColumnName("diagnostico")
            .HasMaxLength(512);

        builder.Property(i => i.EPS)
            .HasColumnName("eps")
            .HasMaxLength(128);

        builder.Property(i => i.Estado)
            .HasColumnName("estado")
            .HasConversion<string>()
            .HasMaxLength(64)
            .IsRequired()
            .HasDefaultValue(EstadoIncapacidad.Registrada);

        builder.Property(i => i.NumeroRadicacion)
            .HasColumnName("numero_radicacion")
            .HasMaxLength(128);

        builder.Property(i => i.FechaRadicacion)
            .HasColumnName("fecha_radicacion");

        builder.Property(i => i.CreatedAt)
            .HasColumnName("creado_el")
            .HasDefaultValueSql("UTC_TIMESTAMP()");

        builder.Property(i => i.CreatedBy)
            .HasColumnName("creado_por")
            .HasMaxLength(100);

        builder.Property(i => i.UpdatedAt)
            .HasColumnName("actualizado_el");

        builder.Property(i => i.UpdatedBy)
            .HasColumnName("actualizado_por")
            .HasMaxLength(100);

        builder.Property(i => i.IsDeleted)
            .HasColumnName("eliminado")
            .HasDefaultValue(false);

        builder.HasMany(i => i.Documentos)
            .WithOne(d => d.Incapacidad)
            .HasForeignKey(d => d.IncapacidadId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(i => i.Pagos)
            .WithOne(p => p.Incapacidad)
            .HasForeignKey(p => p.IncapacidadId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(i => i.Transcripcion)
            .WithOne(t => t.Incapacidad!)
            .HasForeignKey<TranscripcionEPS>(t => t.IncapacidadId);

        builder.HasIndex(i => new { i.EmpleadoId, i.FechaInicio, i.FechaFin })
            .HasDatabaseName("idx_incapacidades_empleado_periodo");

        builder.Navigation(i => i.Documentos)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.Navigation(i => i.Pagos)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}

