using Incapacidades.Domain.Common;

namespace Incapacidades.Domain.Entities;

public class Empleado : AuditableEntity<int>
{
    private readonly List<Incapacidad> _incapacidades = new();

    private Empleado()
    {
    }

    public Empleado(int id, string nombreCompleto, string documentoIdentidad, string? correo, string cargo, DateTime fechaIngreso)
    {
        Id = id;
        NombreCompleto = nombreCompleto;
        DocumentoIdentidad = documentoIdentidad;
        CorreoElectronico = correo;
        Cargo = cargo;
        FechaIngreso = fechaIngreso;
        Estado = true;
    }

    public string NombreCompleto { get; private set; } = string.Empty;
    public string DocumentoIdentidad { get; private set; } = string.Empty;
    public string? CorreoElectronico { get; private set; }
    public string? Telefono { get; private set; }
    public string Cargo { get; private set; } = string.Empty;
    public bool Estado { get; private set; }
    public DateTime FechaIngreso { get; private set; } = DateTime.UtcNow;
    public IReadOnlyCollection<Incapacidad> Incapacidades => _incapacidades.AsReadOnly();

    public void Desactivar(string usuario)
    {
        Estado = false;
        UpdatedAt = DateTime.UtcNow;
        UpdatedBy = usuario;
    }

    public void Reactivar(string usuario)
    {
        Estado = true;
        UpdatedAt = DateTime.UtcNow;
        UpdatedBy = usuario;
    }

    public void ActualizarInformacion(string nombreCompleto, string? correoElectronico, string? telefono, string cargo, string usuario)
    {
        NombreCompleto = nombreCompleto;
        CorreoElectronico = correoElectronico;
        Telefono = telefono;
        Cargo = cargo;
        UpdatedAt = DateTime.UtcNow;
        UpdatedBy = usuario;
    }

    public void AgregarIncapacidad(Incapacidad incapacidad)
    {
        _incapacidades.Add(incapacidad);
    }
}

