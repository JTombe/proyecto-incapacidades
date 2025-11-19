namespace Incapacidades.Application.DTOs.Responses;

public class EstadoCobroResponse
{
    public Guid IncapacidadId { get; set; }
    public bool EsPagado { get; set; }
    public string Estado { get; set; } = string.Empty;
    public DateTime? FechaPago { get; set; }
    public decimal? ValorPagado { get; set; }
}

