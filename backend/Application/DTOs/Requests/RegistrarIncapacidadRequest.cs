using Incapacidades.Domain.Enums;

namespace Incapacidades.Application.DTOs.Requests;

public class RegistrarIncapacidadRequest
{
    public int EmpleadoId { get; set; }
    public string? EmpleadoNombre { get; set; }
    public TipoIncapacidad Tipo { get; set; }
    public DateTime FechaInicio { get; set; }
    public int Dias { get; set; }
    public string Diagnostico { get; set; } = string.Empty;
    public string EPS { get; set; } = string.Empty;
    public List<DocumentoCargaRequest> Documentos { get; set; } = new();

    public DateTime CalcularFechaFin() => FechaInicio.AddDays(Math.Max(Dias, 1) - 1);
}

