namespace Incapacidades.Application.DTOs.Responses;

public class EmpleadoResponse
{
    public int Id { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string DocumentoIdentidad { get; set; } = string.Empty;
    public string? CorreoElectronico { get; set; }
    public string? Telefono { get; set; }
    public string Cargo { get; set; } = string.Empty;
    public bool Estado { get; set; }
    public DateTime FechaIngreso { get; set; }
    public int CantidadIncapacidades { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}