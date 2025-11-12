using Incapacidades.Domain.Entities;

namespace Incapacidades.Application.Interfaces.Repositories;

public interface IIncapacidadRepository
{
    Task AddAsync(Incapacidad incapacidad, CancellationToken cancellationToken = default);
    Task<Incapacidad?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<Incapacidad>> GetByEmpleadoAsync(int empleadoId, DateTime? desde, DateTime? hasta, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

