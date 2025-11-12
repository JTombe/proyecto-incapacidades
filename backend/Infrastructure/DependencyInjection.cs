using Incapacidades.Application.Interfaces;
using Incapacidades.Application.Interfaces.Repositories;
using Incapacidades.Infrastructure.Persistence;
using Incapacidades.Infrastructure.Repositories;
using Incapacidades.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Incapacidades.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("IncapacidadesDatabase");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("La cadena de conexión 'IncapacidadesDatabase' no está configurada.");
        }

        services.AddDbContext<IncapacidadesDbContext>(options =>
        {
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        });

        services.AddScoped<IIncapacidadRepository, IncapacidadRepository>();
        services.AddScoped<IDocumentStorageService, LocalDocumentStorageService>();

        return services;
    }
}

