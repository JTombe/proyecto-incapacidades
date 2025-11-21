using Incapacidades.Domain.Enums;

namespace Incapacidades.Application.Interfaces;

public interface IEPSService
{
    Task<bool> RadicarIncapacidadAsync(Guid incapacidadId, CancellationToken cancellationToken = default);
    Task<EstadoTranscripcion> VerificarTranscripcionAsync(Guid incapacidadId, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<PagoPendienteDto>> ObtenerPagosPendientesAsync(CancellationToken cancellationToken = default);
}

public record PagoPendienteDto(Guid IncapacidadId, DateTime Periodo, decimal Valor, string EPS);

