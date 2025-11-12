using Incapacidades.API.Contracts.Requests;
using Incapacidades.Application.DTOs.Requests;
using Incapacidades.Application.DTOs.Responses;
using Incapacidades.Application.Interfaces;
using Incapacidades.Domain.Enums;
using Incapacidades.Shared.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Incapacidades.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IncapacidadesController : ControllerBase
{
    private readonly IIncapacidadService _incapacidadService;
    private readonly ILogger<IncapacidadesController> _logger;

    public IncapacidadesController(IIncapacidadService incapacidadService, ILogger<IncapacidadesController> logger)
    {
        _incapacidadService = incapacidadService;
        _logger = logger;
    }

    [HttpPost("registrar")]
    [Authorize(Policy = "GestionHumana")]
    [ProducesResponseType(typeof(ApiResponse<IncapacidadResponse>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<IncapacidadResponse>>> Registrar(
        [FromForm] RegistrarIncapacidadFormRequest request,
        CancellationToken cancellationToken)
    {
        var registrarRequest = await ConstruirRegistrarRequestAsync(request, cancellationToken);

        var response = await _incapacidadService.RegistrarIncapacidadAsync(registrarRequest, cancellationToken);
        var apiResponse = ApiResponse<IncapacidadResponse>.SuccessResponse(response, "Incapacidad registrada correctamente.");

        return CreatedAtAction(nameof(ObtenerPorId), new { id = response.Id }, apiResponse);
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IncapacidadResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<IncapacidadResponse>>> ObtenerPorId(Guid id, CancellationToken cancellationToken)
    {
        var response = await _incapacidadService.ObtenerPorIdAsync(id, cancellationToken);
        if (response is null)
        {
            return NotFound(ApiResponse<IncapacidadResponse>.FailureResponse("Incapacidad no encontrada."));
        }

        return Ok(ApiResponse<IncapacidadResponse>.SuccessResponse(response));
    }

    [HttpPut("{id:guid}/estado")]
    [Authorize(Policy = "GestionHumana")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ActualizarEstado(Guid id, [FromBody] ActualizarEstadoIncapacidadRequest request, CancellationToken cancellationToken)
    {
        try
        {
            await _incapacidadService.ActualizarEstadoAsync(id, request, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Intento de actualización de incapacidad inexistente {IncapacidadId}", id);
            return NotFound(ApiResponse<string>.FailureResponse(ex.Message));
        }
    }

    [HttpGet("empleado/{empleadoId:int}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyCollection<IncapacidadResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyCollection<IncapacidadResponse>>>> ObtenerPorEmpleado(
        int empleadoId,
        [FromQuery] DateTime? desde,
        [FromQuery] DateTime? hasta,
        CancellationToken cancellationToken)
    {
        var response = await _incapacidadService.ObtenerPorEmpleadoAsync(empleadoId, desde, hasta, cancellationToken);
        return Ok(ApiResponse<IReadOnlyCollection<IncapacidadResponse>>.SuccessResponse(response));
    }

    [HttpPost("{id:guid}/documentos")]
    [Authorize(Policy = "GestionHumana")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AgregarDocumentos(Guid id, [FromForm] IFormFileCollection archivos, CancellationToken cancellationToken)
    {
        var documentos = new List<DocumentoCargaRequest>();

        foreach (var archivo in archivos)
        {
            documentos.Add(new DocumentoCargaRequest(
                archivo.FileName,
                archivo.ContentType,
                await ConvertirArchivoAsync(archivo, cancellationToken),
                TipoDocumento.Incapacidad));
        }

        try
        {
            await _incapacidadService.AgregarDocumentosAsync(id, documentos, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "No se encontraron registros para agregar documentos a la incapacidad {IncapacidadId}", id);
            return NotFound(ApiResponse<string>.FailureResponse(ex.Message));
        }
    }

    private async Task<RegistrarIncapacidadRequest> ConstruirRegistrarRequestAsync(RegistrarIncapacidadFormRequest request, CancellationToken cancellationToken)
    {
        var documentos = new List<DocumentoCargaRequest>();

        if (request.Documentos is not null)
        {
            for (var i = 0; i < request.Documentos.Length; i++)
            {
                var archivo = request.Documentos[i];
                var tipo = ObtenerTipoDocumento(request.TiposDocumentos, i);

                documentos.Add(new DocumentoCargaRequest(
                    archivo.FileName,
                    archivo.ContentType,
                    await ConvertirArchivoAsync(archivo, cancellationToken),
                    tipo));
            }
        }

        return new RegistrarIncapacidadRequest
        {
            EmpleadoId = request.EmpleadoId,
            EmpleadoNombre = request.EmpleadoNombre,
            Tipo = request.Tipo,
            FechaInicio = request.FechaInicio,
            Dias = request.Dias,
            Diagnostico = request.Diagnostico,
            EPS = request.EPS,
            Documentos = documentos
        };
    }

    private static TipoDocumento ObtenerTipoDocumento(List<TipoDocumento>? tipos, int indice)
    {
        if (tipos is null || tipos.Count <= indice)
        {
            return TipoDocumento.Incapacidad;
        }

        return tipos[indice];
    }

    private static async Task<byte[]> ConvertirArchivoAsync(IFormFile archivo, CancellationToken cancellationToken)
    {
        await using var memory = new MemoryStream();
        await archivo.CopyToAsync(memory, cancellationToken);
        return memory.ToArray();
    }
}

