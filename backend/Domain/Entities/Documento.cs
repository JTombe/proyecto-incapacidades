using Incapacidades.Domain.Common;
using Incapacidades.Domain.Enums;

namespace Incapacidades.Domain.Entities;

public class Documento : AuditableEntity<Guid>
{
    private Documento()
    {
    }

    public Documento(Guid incapacidadId, TipoDocumento tipo, string urlArchivo, string? nombreOriginal = null)
    {
        if (string.IsNullOrWhiteSpace(urlArchivo))
        {
            throw new ArgumentException("La URL del archivo es obligatoria.", nameof(urlArchivo));
        }

        Id = Guid.NewGuid();
        IncapacidadId = incapacidadId;
        Tipo = tipo;
        UrlArchivo = urlArchivo;
        NombreOriginal = nombreOriginal;
        FechaCarga = DateTime.UtcNow;
    }

    public Guid IncapacidadId { get; private set; }
    public TipoDocumento Tipo { get; private set; }
    public string UrlArchivo { get; private set; } = string.Empty;
    public string? NombreOriginal { get; private set; }
    public DateTime FechaCarga { get; private set; }

    public Incapacidad? Incapacidad { get; private set; }
}

