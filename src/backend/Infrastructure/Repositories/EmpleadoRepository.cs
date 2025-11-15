using Incapacidades.Application.Interfaces.Repositories;
using Incapacidades.Domain.Entities;
using Incapacidades.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Incapacidades.Infrastructure.Repositories;

public class EmpleadoRepository : IEmpleadoRepository
{
    private readonly IncapacidadesDbContext _context;

    public EmpleadoRepository(IncapacidadesDbContext context)
    {
        _context = context;
    }

    public async Task<Empleado?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Empleados
            .Include(e => e.Incapacidades.Where(i => !i.IsDeleted))
            .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted, cancellationToken);
    }

    public async Task<Empleado?> GetByIdentificacionAsync(string numeroIdentificacion, CancellationToken cancellationToken = default)
    {
        return await _context.Empleados
            .Include(e => e.Incapacidades.Where(i => !i.IsDeleted))
            .FirstOrDefaultAsync(e => e.DocumentoIdentidad == numeroIdentificacion && !e.IsDeleted, cancellationToken);
    }

    public async Task<IReadOnlyCollection<Empleado>> GetAllAsync(bool? activo = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Empleados
            .Include(e => e.Incapacidades.Where(i => !i.IsDeleted))
            .Where(e => !e.IsDeleted);

        if (activo.HasValue)
        {
            query = query.Where(e => e.Estado == activo.Value);
        }

        return await query
            .OrderBy(e => e.NombreCompleto)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<Empleado>> GetByEPSAsync(int epsId, CancellationToken cancellationToken = default)
    {
        // Note: This would need to be implemented based on the actual relationship with EPS
        // For now, returning empty collection as EPS relationship might not be directly in Empleado entity
        return await Task.FromResult<IReadOnlyCollection<Empleado>>(new List<Empleado>());
    }

    public async Task AddAsync(Empleado empleado, CancellationToken cancellationToken = default)
    {
        await _context.Empleados.AddAsync(empleado, cancellationToken);
    }

    public async Task UpdateAsync(Empleado empleado, CancellationToken cancellationToken = default)
    {
        _context.Empleados.Update(empleado);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(int id, string usuario, CancellationToken cancellationToken = default)
    {
        var empleado = await _context.Empleados.FindAsync(new object[] { id }, cancellationToken);
        if (empleado is not null && !empleado.IsDeleted)
        {
            empleado.MarkAsDeleted(usuario);
            _context.Empleados.Update(empleado);
        }
    }

    public Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default)
    {
        return _context.Empleados.AnyAsync(e => e.Id == id && !e.IsDeleted, cancellationToken);
    }

    public Task<bool> ExistsByIdentificacionAsync(string numeroIdentificacion, CancellationToken cancellationToken = default)
    {
        return _context.Empleados.AnyAsync(e => e.DocumentoIdentidad == numeroIdentificacion && !e.IsDeleted, cancellationToken);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
}