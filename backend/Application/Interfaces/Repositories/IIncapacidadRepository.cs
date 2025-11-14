using Incapacidades.Domain.Entities;
using Incapacidades.Domain.Enums;

namespace Incapacidades.Application.Interfaces.Repositories;

public interface IIncapacidadRepository
{
    Task AddAsync(Incapacidad incapacidad, CancellationToken cancellationToken = default);
    Task<Incapacidad?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Incapacidad>> GetByEmpleadoAsync(int empleadoId, DateTime? desde, DateTime? hasta, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Incapacidad>> GetAllAsync(EstadoIncapacidad? estado = null, DateTime? desde = null, DateTime? hasta = null, CancellationToken cancellationToken = default);
    Task UpdateAsync(Incapacidad incapacidad, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, string usuario, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

