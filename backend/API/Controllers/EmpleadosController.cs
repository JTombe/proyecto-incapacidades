using Incapacidades.Application.DTOs.Requests;
using Incapacidades.Application.DTOs.Responses;
using Incapacidades.Application.Interfaces;
using Incapacidades.Shared.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Incapacidades.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "GestionHumana")]
public class EmpleadosController : ControllerBase
{
    private readonly IEmpleadoService _empleadoService;
    private readonly ILogger<EmpleadosController> _logger;

    public EmpleadosController(IEmpleadoService empleadoService, ILogger<EmpleadosController> logger)
    {
        _empleadoService = empleadoService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyCollection<EmpleadoResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyCollection<EmpleadoResponse>>>> ObtenerTodos(
        [FromQuery] bool? activo,
        CancellationToken cancellationToken)
    {
        var response = await _empleadoService.ObtenerTodosAsync(activo, cancellationToken);
        return Ok(ApiResponse<IReadOnlyCollection<EmpleadoResponse>>.SuccessResponse(response));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<EmpleadoResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<EmpleadoResponse>>> ObtenerPorId(int id, CancellationToken cancellationToken)
    {
        var response = await _empleadoService.ObtenerPorIdAsync(id, cancellationToken);
        if (response is null)
        {
            return NotFound(ApiResponse<EmpleadoResponse>.FailureResponse("Empleado no encontrado."));
        }

        return Ok(ApiResponse<EmpleadoResponse>.SuccessResponse(response));
    }

    [HttpGet("identificacion/{numeroIdentificacion}")]
    [ProducesResponseType(typeof(ApiResponse<EmpleadoResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<EmpleadoResponse>>> ObtenerPorIdentificacion(
        string numeroIdentificacion,
        CancellationToken cancellationToken)
    {
        var response = await _empleadoService.ObtenerPorIdentificacionAsync(numeroIdentificacion, cancellationToken);
        if (response is null)
        {
            return NotFound(ApiResponse<EmpleadoResponse>.FailureResponse("Empleado no encontrado."));
        }

        return Ok(ApiResponse<EmpleadoResponse>.SuccessResponse(response));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<EmpleadoResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<EmpleadoResponse>>> Crear(
        [FromBody] CrearEmpleadoRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var response = await _empleadoService.CrearEmpleadoAsync(request, cancellationToken);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = response.Id }, ApiResponse<EmpleadoResponse>.SuccessResponse(response, "Empleado creado correctamente."));
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Intento de crear empleado con identificación duplicada: {Identificacion}", request.DocumentoIdentidad);
            return BadRequest(ApiResponse<EmpleadoResponse>.FailureResponse(ex.Message));
        }
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<EmpleadoResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<EmpleadoResponse>>> Actualizar(
        int id,
        [FromBody] ActualizarEmpleadoRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var response = await _empleadoService.ActualizarEmpleadoAsync(id, request, cancellationToken);
            return Ok(ApiResponse<EmpleadoResponse>.SuccessResponse(response, "Empleado actualizado correctamente."));
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Intento de actualizar empleado inexistente {EmpleadoId}", id);
            return NotFound(ApiResponse<EmpleadoResponse>.FailureResponse(ex.Message));
        }
    }

    [HttpPut("{id:int}/desactivar")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Desactivar(int id, CancellationToken cancellationToken)
    {
        try
        {
            var usuario = User.Identity?.Name ?? "sistema";
            await _empleadoService.DesactivarEmpleadoAsync(id, usuario, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Intento de desactivar empleado inexistente {EmpleadoId}", id);
            return NotFound(ApiResponse<string>.FailureResponse(ex.Message));
        }
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Eliminar(int id, CancellationToken cancellationToken)
    {
        try
        {
            var usuario = User.Identity?.Name ?? "sistema";
            await _empleadoService.EliminarEmpleadoAsync(id, usuario, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Intento de eliminar empleado inexistente {EmpleadoId}", id);
            return NotFound(ApiResponse<string>.FailureResponse(ex.Message));
        }
    }
}