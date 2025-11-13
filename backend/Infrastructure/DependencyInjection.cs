using Incapacidades.Application.Interfaces;
using Incapacidades.Application.Interfaces.Repositories;
using Incapacidades.Infrastructure.Persistence;
using Incapacidades.Infrastructure.Repositories;
using Incapacidades.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace Incapacidades.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Intentamos leer la connection string habitual (p.ej. desde
        // `ASPNETCORE_ConnectionStrings__IncapacidadesDatabase`). Si no está
        // presente o contiene placeholders sin interpolar (p.ej. "${DB_PORT}")
        // hacemos un fallback seguro y construimos la cadena en runtime.
        var connectionString = configuration.GetConnectionString("IncapacidadesDatabase");

        // Si la cadena está vacía, contiene una variable sin resolver (${...}),
        // o intenta conectar a 'localhost' (que no funciona dentro del contenedor),
        // armamos una connection string por defecto que apunta al servicio 'mariadb'
        // dentro de la red de docker-compose (puerto interno 3306).
        if (string.IsNullOrWhiteSpace(connectionString) ||
            connectionString.Contains("${") ||
            connectionString.Contains("localhost", StringComparison.OrdinalIgnoreCase) ||
            connectionString.Contains("127.0.0.1", StringComparison.OrdinalIgnoreCase))
        {
            var dbName = configuration["DB_NAME"] ?? "gestion_incapacidades";
            var dbUser = configuration["DB_USER"] ?? "root";
            var dbPassword = configuration["DB_PASSWORD"] ?? "120054";

            if (string.IsNullOrWhiteSpace(dbName))
            {
                throw new InvalidOperationException("No se encontró DB_NAME en la configuración. Configure la BD en .env o en la connection string.");
            }

            // Conexión dentro del contenedor: server 'mariadb' y puerto 3306
            connectionString = $"Server=mariadb;Port=3306;Database={dbName};User={dbUser};Password={dbPassword};";
        }

        services.AddDbContext<IncapacidadesDbContext>(options =>
        {
            try
            {
                var serverVersion = ServerVersion.AutoDetect(connectionString);
                options.UseMySql(connectionString, serverVersion);
            }
            catch (Exception)
            {
                // Si AutoDetect falla por cualquier razón, forzamos una versión
                // de MariaDB razonable para que la aplicación pueda arrancar.
                var fallbackVersion = new MariaDbServerVersion(new Version(10, 11, 0));
                options.UseMySql(connectionString, fallbackVersion);
            }
        });

        services.AddScoped<IIncapacidadRepository, IncapacidadRepository>();
        services.AddScoped<IDocumentStorageService, LocalDocumentStorageService>();

        return services;
    }
}

