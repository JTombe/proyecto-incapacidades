namespace Incapacidades.Application.DTOs.Requests;

public class ActualizarEmpleadoRequest
{
    public string? NombreCompleto { get; set; }
    public string? CorreoElectronico { get; set; }
    public string? Telefono { get; set; }
    public string? Cargo { get; set; }
    public bool? Estado { get; set; }
    public string Usuario { get; set; } = string.Empty;
}