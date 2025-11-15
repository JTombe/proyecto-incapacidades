using Incapacidades.Application.DTOs.Requests;
using Incapacidades.Application.DTOs.Responses;
using Incapacidades.Application.Interfaces;
using Incapacidades.Application.Interfaces.Repositories;
using Incapacidades.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Incapacidades.Application.Services;

public class EmpleadoService : IEmpleadoService
{
    private readonly IEmpleadoRepository _empleadoRepository;
    private readonly ILogger<EmpleadoService> _logger;

    public EmpleadoService(IEmpleadoRepository empleadoRepository, ILogger<EmpleadoService> logger)
    {
        _empleadoRepository = empleadoRepository;
        _logger = logger;
    }

    public async Task<EmpleadoResponse?> ObtenerPorIdAsync(int empleadoId, CancellationToken cancellationToken = default)
    {
        var empleado = await _empleadoRepository.GetByIdAsync(empleadoId, cancellationToken);
        return empleado is null ? null : MapToResponse(empleado);
    }

    public async Task<EmpleadoResponse?> ObtenerPorIdentificacionAsync(string numeroIdentificacion, CancellationToken cancellationToken = default)
    {
        var empleado = await _empleadoRepository.GetByIdentificacionAsync(numeroIdentificacion, cancellationToken);
        return empleado is null ? null : MapToResponse(empleado);
    }

    public async Task<IReadOnlyCollection<EmpleadoResponse>> ObtenerTodosAsync(bool? activo = null, CancellationToken cancellationToken = default)
    {
        var empleados = await _empleadoRepository.GetAllAsync(activo, cancellationToken);
        return empleados.Select(MapToResponse).ToList();
    }

    public async Task<EmpleadoResponse> CrearEmpleadoAsync(CrearEmpleadoRequest request, CancellationToken cancellationToken = default)
    {
        // Validar que no exista un empleado con la misma identificación
        if (await _empleadoRepository.ExistsByIdentificacionAsync(request.DocumentoIdentidad, cancellationToken))
        {
            throw new InvalidOperationException($"Ya existe un empleado con la identificación {request.DocumentoIdentidad}");
        }

        var empleado = new Empleado(
            0, // ID will be auto-generated
            request.NombreCompleto,
            request.DocumentoIdentidad,
            request.CorreoElectronico,
            request.Cargo,
            request.FechaIngreso
        );

        await _empleadoRepository.AddAsync(empleado, cancellationToken);
        await _empleadoRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Empleado {EmpleadoId} creado: {NombreCompleto}", empleado.Id, empleado.NombreCompleto);

        return MapToResponse(empleado);
    }

    public async Task<EmpleadoResponse> ActualizarEmpleadoAsync(int empleadoId, ActualizarEmpleadoRequest request, CancellationToken cancellationToken = default)
    {
        var empleado = await _empleadoRepository.GetByIdAsync(empleadoId, cancellationToken)
                        ?? throw new KeyNotFoundException($"Empleado {empleadoId} no encontrado");

        // Actualizar información básica
        if (!string.IsNullOrWhiteSpace(request.NombreCompleto) ||
            request.CorreoElectronico is not null ||
            request.Telefono is not null ||
            !string.IsNullOrWhiteSpace(request.Cargo))
        {
            empleado.ActualizarInformacion(
                request.NombreCompleto ?? empleado.NombreCompleto,
                request.CorreoElectronico ?? empleado.CorreoElectronico,
                request.Telefono ?? empleado.Telefono,
                request.Cargo ?? empleado.Cargo,
                request.Usuario
            );
        }

        // Actualizar estado si se proporciona
        if (request.Estado.HasValue && request.Estado.Value != empleado.Estado)
        {
            if (request.Estado.Value)
            {
                empleado.Reactivar(request.Usuario);
            }
            else
            {
                empleado.Desactivar(request.Usuario);
            }
        }

        await _empleadoRepository.UpdateAsync(empleado, cancellationToken);
        await _empleadoRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Empleado {EmpleadoId} actualizado por {Usuario}", empleadoId, request.Usuario);

        return MapToResponse(empleado);
    }

    public async Task DesactivarEmpleadoAsync(int empleadoId, string usuario, CancellationToken cancellationToken = default)
    {
        var empleado = await _empleadoRepository.GetByIdAsync(empleadoId, cancellationToken)
                        ?? throw new KeyNotFoundException($"Empleado {empleadoId} no encontrado");

        empleado.Desactivar(usuario);

        await _empleadoRepository.UpdateAsync(empleado, cancellationToken);
        await _empleadoRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Empleado {EmpleadoId} desactivado por {Usuario}", empleadoId, usuario);
    }

    public async Task EliminarEmpleadoAsync(int empleadoId, string usuario, CancellationToken cancellationToken = default)
    {
        var exists = await _empleadoRepository.ExistsAsync(empleadoId, cancellationToken);
        if (!exists)
        {
            throw new KeyNotFoundException($"Empleado {empleadoId} no encontrado");
        }

        await _empleadoRepository.DeleteAsync(empleadoId, usuario, cancellationToken);
        await _empleadoRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Empleado {EmpleadoId} eliminado (soft delete) por {Usuario}", empleadoId, usuario);
    }

    private static EmpleadoResponse MapToResponse(Empleado empleado)
    {
        return new EmpleadoResponse
        {
            Id = empleado.Id,
            NombreCompleto = empleado.NombreCompleto,
            DocumentoIdentidad = empleado.DocumentoIdentidad,
            CorreoElectronico = empleado.CorreoElectronico,
            Telefono = empleado.Telefono,
            Cargo = empleado.Cargo,
            Estado = empleado.Estado,
            FechaIngreso = empleado.FechaIngreso,
            CantidadIncapacidades = empleado.Incapacidades.Count,
            CreatedAt = empleado.CreatedAt,
            UpdatedAt = empleado.UpdatedAt
        };
    }
}