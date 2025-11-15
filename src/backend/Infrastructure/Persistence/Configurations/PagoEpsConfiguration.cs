using Incapacidades.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Incapacidades.Infrastructure.Persistence.Configurations;

public class PagoEpsConfiguration : IEntityTypeConfiguration<PagoEPS>
{
    public void Configure(EntityTypeBuilder<PagoEPS> builder)
    {
        builder.ToTable("pagos_eps");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(p => p.IncapacidadId)
            .HasColumnName("incapacidad_id")
            .IsRequired();

        builder.Property(p => p.Valor)
            .HasColumnName("valor")
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(p => p.Periodo)
            .HasColumnName("periodo")
            .IsRequired();

        builder.Property(p => p.Referencia)
            .HasColumnName("referencia")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(p => p.Estado)
            .HasColumnName("estado")
            .HasMaxLength(50)
            .HasDefaultValue("Pendiente");

        builder.Property(p => p.FechaPago)
            .HasColumnName("fecha_pago");

        builder.Property(p => p.CreatedAt)
            .HasColumnName("creado_el")
            .HasDefaultValueSql("UTC_TIMESTAMP()");
    }
}

