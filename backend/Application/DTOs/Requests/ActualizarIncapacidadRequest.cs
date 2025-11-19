using Incapacidades.Domain.Enums;

namespace Incapacidades.Application.DTOs.Requests;

public class ActualizarIncapacidadRequest
{
    public TipoIncapacidad? Tipo { get; set; }
    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }
    public string? Diagnostico { get; set; }
    public string? EPS { get; set; }
    public string Usuario { get; set; } = string.Empty;
}