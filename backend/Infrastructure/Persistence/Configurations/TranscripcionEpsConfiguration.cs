using Incapacidades.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Incapacidades.Infrastructure.Persistence.Configurations;

public class TranscripcionEpsConfiguration : IEntityTypeConfiguration<TranscripcionEPS>
{
    public void Configure(EntityTypeBuilder<TranscripcionEPS> builder)
    {
        builder.ToTable("transcripciones_eps");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(t => t.IncapacidadId)
            .HasColumnName("incapacidad_id")
            .IsRequired();

        builder.Property(t => t.NumeroTranscripcion)
            .HasColumnName("numero_transcripcion")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(t => t.Estado)
            .HasColumnName("estado")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(t => t.FechaRespuesta)
            .HasColumnName("fecha_respuesta");

        builder.Property(t => t.Observaciones)
            .HasColumnName("observaciones")
            .HasMaxLength(500);

        builder.Property(t => t.CreatedAt)
            .HasColumnName("creado_el")
            .HasDefaultValueSql("UTC_TIMESTAMP()");
    }
}

