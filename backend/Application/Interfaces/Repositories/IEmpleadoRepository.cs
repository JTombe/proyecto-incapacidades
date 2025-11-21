using Incapacidades.Domain.Entities;

namespace Incapacidades.Application.Interfaces.Repositories;

public interface IEmpleadoRepository
{
    Task<Empleado?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Empleado?> GetByIdentificacionAsync(string numeroIdentificacion, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Empleado>> GetAllAsync(bool? activo = null, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Empleado>> GetByEPSAsync(int epsId, CancellationToken cancellationToken = default);
    Task AddAsync(Empleado empleado, CancellationToken cancellationToken = default);
    Task UpdateAsync(Empleado empleado, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, string usuario, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> ExistsByIdentificacionAsync(string numeroIdentificacion, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}