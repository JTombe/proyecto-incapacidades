using Incapacidades.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Incapacidades.Infrastructure.Persistence.Configurations;

public class DocumentoConfiguration : IEntityTypeConfiguration<Documento>
{
    public void Configure(EntityTypeBuilder<Documento> builder)
    {
        builder.ToTable("documentos_incapacidad");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(d => d.IncapacidadId)
            .HasColumnName("incapacidad_id")
            .IsRequired();

        builder.Property(d => d.Tipo)
            .HasColumnName("tipo")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(d => d.UrlArchivo)
            .HasColumnName("url_archivo")
            .HasMaxLength(512)
            .IsRequired();

        builder.Property(d => d.NombreOriginal)
            .HasColumnName("nombre_original")
            .HasMaxLength(255);

        builder.Property(d => d.FechaCarga)
            .HasColumnName("fecha_carga")
            .HasDefaultValueSql("UTC_TIMESTAMP()");

        builder.Property(d => d.CreatedAt)
            .HasColumnName("creado_el")
            .HasDefaultValueSql("UTC_TIMESTAMP()");

        builder.Property(d => d.CreatedBy)
            .HasColumnName("creado_por")
            .HasMaxLength(100);
    }
}

