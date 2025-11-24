using Incapacidades.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Incapacidades.Infrastructure.Persistence.Configurations;

public class EmpleadoConfiguration : IEntityTypeConfiguration<Empleado>
{
    public void Configure(EntityTypeBuilder<Empleado> builder)
    {
        builder.ToTable("empleados");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        builder.Property(e => e.NombreCompleto)
            .HasColumnName("nombre_completo")
            .HasMaxLength(200);

        builder.Property(e => e.DocumentoIdentidad)
            .HasColumnName("documento_identidad")
            .HasMaxLength(50);

        builder.Property(e => e.CorreoElectronico)
            .HasColumnName("correo_electronico")
            .HasMaxLength(150);

        builder.Property(e => e.Cargo)
            .HasColumnName("cargo")
            .HasMaxLength(100);

        builder.Property(e => e.Estado)
            .HasColumnName("estado")
            .HasDefaultValue(true);

        builder.Property(e => e.FechaIngreso)
            .HasColumnName("fecha_ingreso")
            .HasDefaultValueSql("UTC_TIMESTAMP()");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("creado_el")
            .HasDefaultValueSql("UTC_TIMESTAMP()");

        builder.Property(e => e.CreatedBy)
            .HasColumnName("creado_por")
            .HasMaxLength(100);

        builder.Navigation(e => e.Incapacidades)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}

