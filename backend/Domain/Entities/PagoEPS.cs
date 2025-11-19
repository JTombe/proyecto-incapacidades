using Incapacidades.Domain.Common;

namespace Incapacidades.Domain.Entities;

public class PagoEPS : AuditableEntity<Guid>
{
    private PagoEPS()
    {
    }

    public PagoEPS(Guid incapacidadId, decimal valor, DateTime periodo, string referencia)
    {
        if (valor <= 0)
        {
            throw new ArgumentException("El valor del pago debe ser mayor a cero.", nameof(valor));
        }

        Id = Guid.NewGuid();
        IncapacidadId = incapacidadId;
        Valor = valor;
        Periodo = periodo;
        Referencia = referencia;
        Estado = "Pendiente";
    }

    public Guid IncapacidadId { get; private set; }
    public decimal Valor { get; private set; }
    public DateTime Periodo { get; private set; }
    public string Referencia { get; private set; } = string.Empty;
    public string Estado { get; private set; } = string.Empty;
    public DateTime? FechaPago { get; private set; }

    public Incapacidad? Incapacidad { get; private set; }

    public void ConfirmarPago(DateTime fechaPago, string usuario)
    {
        Estado = "Pagado";
        FechaPago = fechaPago;
        UpdatedAt = DateTime.UtcNow;
        UpdatedBy = usuario;
    }
}

