using Incapacidades.Domain.Common;
using Incapacidades.Domain.Enums;

namespace Incapacidades.Domain.Entities;

public class TranscripcionEPS : AuditableEntity<Guid>
{
    private TranscripcionEPS()
    {
    }

    public TranscripcionEPS(Guid incapacidadId, string numeroTranscripcion, EstadoTranscripcion estado)
    {
        Id = Guid.NewGuid();
        IncapacidadId = incapacidadId;
        NumeroTranscripcion = numeroTranscripcion;
        Estado = estado;
    }

    public Guid IncapacidadId { get; private set; }
    public string NumeroTranscripcion { get; private set; } = string.Empty;
    public EstadoTranscripcion Estado { get; private set; }
    public DateTime? FechaRespuesta { get; private set; }
    public string? Observaciones { get; private set; }

    public Incapacidad? Incapacidad { get; private set; }

    public void ActualizarEstado(EstadoTranscripcion estado, string? observaciones = null)
    {
        Estado = estado;
        Observaciones = observaciones;
        FechaRespuesta = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}

