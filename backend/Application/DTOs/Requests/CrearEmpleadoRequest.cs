namespace Incapacidades.Application.DTOs.Requests;

public class CrearEmpleadoRequest
{
    public string NombreCompleto { get; set; } = string.Empty;
    public string DocumentoIdentidad { get; set; } = string.Empty;
    public string? CorreoElectronico { get; set; }
    public string? Telefono { get; set; }
    public string Cargo { get; set; } = string.Empty;
    public DateTime FechaIngreso { get; set; }
}