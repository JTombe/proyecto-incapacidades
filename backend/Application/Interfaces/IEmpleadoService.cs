using Incapacidades.Application.DTOs.Requests;
using Incapacidades.Application.DTOs.Responses;

namespace Incapacidades.Application.Interfaces;

public interface IEmpleadoService
{
    Task<EmpleadoResponse?> ObtenerPorIdAsync(int empleadoId, CancellationToken cancellationToken = default);
    Task<EmpleadoResponse?> ObtenerPorIdentificacionAsync(string numeroIdentificacion, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<EmpleadoResponse>> ObtenerTodosAsync(bool? activo = null, CancellationToken cancellationToken = default);
    Task<EmpleadoResponse> CrearEmpleadoAsync(CrearEmpleadoRequest request, CancellationToken cancellationToken = default);
    Task<EmpleadoResponse> ActualizarEmpleadoAsync(int empleadoId, ActualizarEmpleadoRequest request, CancellationToken cancellationToken = default);
    Task DesactivarEmpleadoAsync(int empleadoId, string usuario, CancellationToken cancellationToken = default);
    Task EliminarEmpleadoAsync(int empleadoId, string usuario, CancellationToken cancellationToken = default);
}