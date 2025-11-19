using Incapacidades.Application.Interfaces.Repositories;
using Incapacidades.Domain.Entities;
using Incapacidades.Domain.Enums;
using Incapacidades.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Incapacidades.Infrastructure.Repositories;

public class IncapacidadRepository : IIncapacidadRepository
{
    private readonly IncapacidadesDbContext _context;

    public IncapacidadRepository(IncapacidadesDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Incapacidad incapacidad, CancellationToken cancellationToken = default)
    {
        await _context.Incapacidades.AddAsync(incapacidad, cancellationToken);
    }

    public async Task<Incapacidad?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Incapacidades
            .Include(i => i.Documentos)
            .Include(i => i.Pagos)
            .Include(i => i.Transcripcion)
            .Include(i => i.Empleado)
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyCollection<Incapacidad>> GetByEmpleadoAsync(int empleadoId, DateTime? desde, DateTime? hasta, CancellationToken cancellationToken = default)
    {
        var query = _context.Incapacidades.AsQueryable();

        query = query
            .Include(i => i.Documentos)
            .Include(i => i.Empleado)
            .Where(i => i.EmpleadoId == empleadoId);

        if (desde.HasValue)
        {
            query = query.Where(i => i.FechaInicio >= desde.Value);
        }

        if (hasta.HasValue)
        {
            query = query.Where(i => i.FechaFin <= hasta.Value);
        }

        return await query
            .OrderByDescending(i => i.FechaInicio)
            .ToListAsync(cancellationToken);
    }

    public Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _context.Incapacidades.AnyAsync(i => i.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyCollection<Incapacidad>> GetAllAsync(EstadoIncapacidad? estado = null, DateTime? desde = null, DateTime? hasta = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Incapacidades
            .Include(i => i.Documentos)
            .Include(i => i.Empleado)
            .Where(i => !i.IsDeleted);

        if (estado.HasValue)
        {
            query = query.Where(i => i.Estado == estado.Value);
        }

        if (desde.HasValue)
        {
            query = query.Where(i => i.FechaInicio >= desde.Value);
        }

        if (hasta.HasValue)
        {
            query = query.Where(i => i.FechaFin <= hasta.Value);
        }

        return await query
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task UpdateAsync(Incapacidad incapacidad, CancellationToken cancellationToken = default)
    {
        _context.Incapacidades.Update(incapacidad);
        await Task.CompletedTask; // EF Core tracks changes automatically
    }

    public async Task DeleteAsync(Guid id, string usuario, CancellationToken cancellationToken = default)
    {
        var incapacidad = await _context.Incapacidades.FindAsync(new object[] { id }, cancellationToken);
        if (incapacidad is not null && !incapacidad.IsDeleted)
        {
            incapacidad.MarkAsDeleted(usuario);
            _context.Incapacidades.Update(incapacidad);
        }
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
}

