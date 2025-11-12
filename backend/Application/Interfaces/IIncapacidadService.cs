using Incapacidades.Application.DTOs.Requests;
using Incapacidades.Application.DTOs.Responses;

namespace Incapacidades.Application.Interfaces;

public interface IIncapacidadService
{
    Task<IncapacidadResponse> RegistrarIncapacidadAsync(RegistrarIncapacidadRequest request, CancellationToken cancellationToken = default);
    Task<IncapacidadResponse?> ObtenerPorIdAsync(Guid incapacidadId, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<IncapacidadResponse>> ObtenerPorEmpleadoAsync(int empleadoId, DateTime? desde, DateTime? hasta, CancellationToken cancellationToken = default);
    Task ActualizarEstadoAsync(Guid incapacidadId, ActualizarEstadoIncapacidadRequest request, CancellationToken cancellationToken = default);
    Task AgregarDocumentosAsync(Guid incapacidadId, IEnumerable<DocumentoCargaRequest> documentos, CancellationToken cancellationToken = default);
    Task<bool> ValidarDocumentosAsync(Guid incapacidadId, CancellationToken cancellationToken = default);
    Task<string> TranscribirEPSAsync(Guid incapacidadId, CancellationToken cancellationToken = default);
    Task<EstadoCobroResponse> VerificarEstadoCobroAsync(Guid incapacidadId, CancellationToken cancellationToken = default);
}

