using Incapacidades.Domain.Common;
using Incapacidades.Domain.Enums;

namespace Incapacidades.Domain.Entities;

public class Incapacidad : AuditableEntity<Guid>
{
    private readonly List<Documento> _documentos = new();
    private readonly List<PagoEPS> _pagos = new();

    private Incapacidad()
    {
    }

    public Incapacidad(
        int empleadoId,
        TipoIncapacidad tipo,
        DateTime fechaInicio,
        DateTime fechaFin,
        string diagnostico,
        string eps)
    {
        Id = Guid.NewGuid();
        EmpleadoId = empleadoId;
        Tipo = tipo;
        FechaInicio = fechaInicio;
        FechaFin = fechaFin;
        Diagnostico = diagnostico;
        EPS = eps;
        Estado = EstadoIncapacidad.Registrada;
    }

    public int EmpleadoId { get; private set; }
    public TipoIncapacidad Tipo { get; private set; }
    public DateTime FechaInicio { get; private set; }
    public DateTime FechaFin { get; private set; }
    public string Diagnostico { get; private set; } = string.Empty;
    public string EPS { get; private set; } = string.Empty;
    public EstadoIncapacidad Estado { get; private set; }
    public Guid? TranscripcionId { get; private set; }
    public string? NumeroRadicacion { get; private set; }
    public DateTime? FechaRadicacion { get; private set; }

    public Empleado? Empleado { get; private set; }
    public TranscripcionEPS? Transcripcion { get; private set; }
    public IReadOnlyCollection<Documento> Documentos => _documentos.AsReadOnly();
    public IReadOnlyCollection<PagoEPS> Pagos => _pagos.AsReadOnly();

    public void ActualizarEstado(EstadoIncapacidad nuevoEstado, string usuario)
    {
        Estado = nuevoEstado;
        UpdatedAt = DateTime.UtcNow;
        UpdatedBy = usuario;
    }

    public void ActualizarFechas(DateTime fechaInicio, DateTime fechaFin, string usuario)
    {
        if (fechaFin < fechaInicio)
        {
            throw new ArgumentException("La fecha fin no puede ser menor que la fecha inicio.");
        }

        FechaInicio = fechaInicio;
        FechaFin = fechaFin;
        UpdatedAt = DateTime.UtcNow;
        UpdatedBy = usuario;
    }

    public Documento AgregarDocumento(TipoDocumento tipo, string urlArchivo, string? nombreOriginal = null)
    {
        var documento = new Documento(Id, tipo, urlArchivo, nombreOriginal);
        _documentos.Add(documento);
        UpdatedAt = DateTime.UtcNow;
        return documento;
    }

    public void AsociarTranscripcion(Guid transcripcionId)
    {
        TranscripcionId = transcripcionId;
    }

    public void RegistrarRadicacion(string numeroRadicacion, DateTime fechaRadicacion, string usuario)
    {
        NumeroRadicacion = numeroRadicacion;
        FechaRadicacion = fechaRadicacion;
        UpdatedAt = DateTime.UtcNow;
        UpdatedBy = usuario;
    }

    public void RegistrarPago(PagoEPS pago)
    {
        if (pago.IncapacidadId != Id)
        {
            throw new InvalidOperationException("El pago no pertenece a esta incapacidad.");
        }

        _pagos.Add(pago);
        UpdatedAt = DateTime.UtcNow;
    }
}

