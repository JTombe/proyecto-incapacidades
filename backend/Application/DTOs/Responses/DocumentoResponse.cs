using Incapacidades.Domain.Enums;

namespace Incapacidades.Application.DTOs.Responses;

public record DocumentoResponse(
    Guid Id,
    TipoDocumento Tipo,
    string UrlArchivo,
    DateTime FechaCarga,
    string? NombreOriginal);

