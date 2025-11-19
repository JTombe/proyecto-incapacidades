using Incapacidades.Domain.Enums;

namespace Incapacidades.Application.DTOs.Requests;

public record DocumentoCargaRequest(
    string Nombre,
    string ContentType,
    byte[] Contenido,
    TipoDocumento Tipo);

