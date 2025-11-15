using Incapacidades.Application.DTOs.Requests;

namespace Incapacidades.Application.Interfaces;

public interface IDocumentStorageService
{
    Task<string> GuardarDocumentoAsync(Guid incapacidadId, DocumentoCargaRequest documento, CancellationToken cancellationToken = default);
}

