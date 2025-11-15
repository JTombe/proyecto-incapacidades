using Incapacidades.Domain.Enums;

namespace Incapacidades.Application.DTOs.Responses;

public class IncapacidadResponse
{
    public Guid Id { get; set; }
    public int EmpleadoId { get; set; }
    public string EmpleadoNombre { get; set; } = string.Empty;
    public TipoIncapacidad Tipo { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public EstadoIncapacidad Estado { get; set; }
    public string EPS { get; set; } = string.Empty;
    public string Diagnostico { get; set; } = string.Empty;
    public IReadOnlyCollection<DocumentoResponse> Documentos { get; set; } = Array.Empty<DocumentoResponse>();
}

