using Incapacidades.Domain.Enums;

namespace Incapacidades.Application.DTOs.Requests;

public class ActualizarEstadoIncapacidadRequest
{
    public EstadoIncapacidad Estado { get; set; }
    public string Usuario { get; set; } = "system";
}

