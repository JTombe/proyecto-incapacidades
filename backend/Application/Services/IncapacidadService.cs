using System.Linq;
using Incapacidades.Application.DTOs.Requests;
using Incapacidades.Application.DTOs.Responses;
using Incapacidades.Application.Interfaces;
using Incapacidades.Application.Interfaces.Repositories;
using Incapacidades.Domain.Entities;
using Incapacidades.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace Incapacidades.Application.Services;

public class IncapacidadService : IIncapacidadService
{
    private readonly IIncapacidadRepository _incapacidadRepository;
    private readonly IDocumentStorageService _documentStorageService;
    private readonly IEPSService? _epsService;
    private readonly ILogger<IncapacidadService> _logger;

    public IncapacidadService(
        IIncapacidadRepository incapacidadRepository,
        IDocumentStorageService documentStorageService,
        ILogger<IncapacidadService> logger,
        IEPSService? epsService = null)
    {
        _incapacidadRepository = incapacidadRepository;
        _documentStorageService = documentStorageService;
        _logger = logger;
        _epsService = epsService;
    }

    public async Task<IncapacidadResponse> RegistrarIncapacidadAsync(RegistrarIncapacidadRequest request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Iniciando registro de incapacidad para el empleado {EmpleadoId}", request.EmpleadoId);

        var fechaFin = request.CalcularFechaFin();

        var incapacidad = new Incapacidad(
            request.EmpleadoId,
            request.Tipo,
            request.FechaInicio,
            fechaFin,
            request.Diagnostico,
            request.EPS);

        foreach (var documento in request.Documentos)
        {
            var url = await _documentStorageService.GuardarDocumentoAsync(incapacidad.Id, documento, cancellationToken);
            incapacidad.AgregarDocumento(documento.Tipo, url, documento.Nombre);
        }

        await _incapacidadRepository.AddAsync(incapacidad, cancellationToken);
        await _incapacidadRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Incapacidad {IncapacidadId} registrada correctamente", incapacidad.Id);

        return MapToResponse(incapacidad, request.EmpleadoNombre);
    }

    public async Task<IncapacidadResponse?> ObtenerPorIdAsync(Guid incapacidadId, CancellationToken cancellationToken = default)
    {
        var incapacidad = await _incapacidadRepository.GetByIdWithDetailsAsync(incapacidadId, cancellationToken);
        return incapacidad is null ? null : MapToResponse(incapacidad, incapacidad.Empleado?.NombreCompleto);
    }

    public async Task<IReadOnlyCollection<IncapacidadResponse>> ObtenerPorEmpleadoAsync(int empleadoId, DateTime? desde, DateTime? hasta, CancellationToken cancellationToken = default)
    {
        var incapacidades = await _incapacidadRepository.GetByEmpleadoAsync(empleadoId, desde, hasta, cancellationToken);
        return incapacidades.Select(i => MapToResponse(i, i.Empleado?.NombreCompleto)).ToList();
    }

    public async Task ActualizarEstadoAsync(Guid incapacidadId, ActualizarEstadoIncapacidadRequest request, CancellationToken cancellationToken = default)
    {
        var incapacidad = await _incapacidadRepository.GetByIdWithDetailsAsync(incapacidadId, cancellationToken)
                           ?? throw new KeyNotFoundException($"Incapacidad {incapacidadId} no encontrada");

        incapacidad.ActualizarEstado(request.Estado, request.Usuario);

        await _incapacidadRepository.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Estado de incapacidad {IncapacidadId} actualizado a {Estado}", incapacidadId, request.Estado);
    }

    public async Task AgregarDocumentosAsync(Guid incapacidadId, IEnumerable<DocumentoCargaRequest> documentos, CancellationToken cancellationToken = default)
    {
        var incapacidad = await _incapacidadRepository.GetByIdWithDetailsAsync(incapacidadId, cancellationToken)
                           ?? throw new KeyNotFoundException($"Incapacidad {incapacidadId} no encontrada");

        foreach (var documento in documentos)
        {
            var url = await _documentStorageService.GuardarDocumentoAsync(incapacidad.Id, documento, cancellationToken);
            incapacidad.AgregarDocumento(documento.Tipo, url, documento.Nombre);
        }

        await _incapacidadRepository.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Se agregaron {Cantidad} documentos a la incapacidad {IncapacidadId}", documentos.Count(), incapacidadId);
    }

    public Task<bool> ValidarDocumentosAsync(Guid incapacidadId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Validación de documentos para incapacidad {IncapacidadId}", incapacidadId);
        // Por ahora la validación es mínima; se puede extender con reglas por tipo
        return Task.FromResult(true);
    }

    public async Task<string> TranscribirEPSAsync(Guid incapacidadId, CancellationToken cancellationToken = default)
    {
        if (_epsService is null)
        {
            _logger.LogWarning("Solicitud de transcripción para incapacidad {IncapacidadId} sin servicio EPS configurado", incapacidadId);
            return "Servicio de transcripción no configurado.";
        }

        var result = await _epsService.RadicarIncapacidadAsync(incapacidadId, cancellationToken);
        return result ? "Transcripción enviada exitosamente." : "Fallo al enviar la transcripción.";
    }

    public async Task<EstadoCobroResponse> VerificarEstadoCobroAsync(Guid incapacidadId, CancellationToken cancellationToken = default)
    {
        var incapacidad = await _incapacidadRepository.GetByIdWithDetailsAsync(incapacidadId, cancellationToken)
                           ?? throw new KeyNotFoundException($"Incapacidad {incapacidadId} no encontrada");

        var ultimoPago = incapacidad.Pagos.OrderByDescending(p => p.FechaPago).FirstOrDefault();

        return new EstadoCobroResponse
        {
            IncapacidadId = incapacidad.Id,
            EsPagado = ultimoPago is not null && ultimoPago.Estado.Equals("Pagado", StringComparison.OrdinalIgnoreCase),
            Estado = ultimoPago?.Estado ?? EstadoIncapacidad.Registrada.ToString(),
            FechaPago = ultimoPago?.FechaPago,
            ValorPagado = ultimoPago?.Valor
        };
    }

    private static IncapacidadResponse MapToResponse(Incapacidad incapacidad, string? empleadoNombre)
    {
        return new IncapacidadResponse
        {
            Id = incapacidad.Id,
            EmpleadoId = incapacidad.EmpleadoId,
            EmpleadoNombre = empleadoNombre ?? string.Empty,
            Tipo = incapacidad.Tipo,
            FechaInicio = incapacidad.FechaInicio,
            FechaFin = incapacidad.FechaFin,
            Estado = incapacidad.Estado,
            EPS = incapacidad.EPS,
            Diagnostico = incapacidad.Diagnostico,
            Documentos = incapacidad.Documentos
                .Select(d => new DocumentoResponse(d.Id, d.Tipo, d.UrlArchivo, d.FechaCarga, d.NombreOriginal))
                .ToArray()
        };
    }
}

