using Incapacidades.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace Incapacidades.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(IncapacidadesDbContext db, IConfiguration configuration, ILogger logger)
    {
        try
        {
            // Asegurarnos de que la base de datos tiene las tablas creadas.
            // Si no existen, `AnyAsync()` lanzará una excepción; en ese caso
            // usamos EnsureCreated para crear el esquema a partir del modelo.
            try
            {
                if (await db.Set<User>().AnyAsync())
                {
                    logger.LogInformation("Usuarios ya presentes en la base de datos; saltando seed.");
                    return;
                }
            }
            catch (Exception exTable)
            {
                logger.LogWarning(exTable, "Tabla Users no encontrada. Intentando crear el esquema con EnsureCreated().");
                await db.Database.EnsureCreatedAsync();

                // Si EnsureCreated no creó las tablas (por ejemplo porque existe __EFMigrationsHistory),
                // evitamos lanzar y terminamos el seed con una advertencia para no hacer fallar el contenedor.
                try
                {
                    if (!await db.Set<User>().AnyAsync())
                    {
                        logger.LogWarning("Después de EnsureCreated(), la tabla Users sigue sin existir — saltando seed. Agregue migraciones o cree la tabla manualmente.");
                        return;
                    }
                }
                catch (Exception exStill)
                {
                    logger.LogWarning(exStill, "Después de EnsureCreated() la tabla Users no está disponible — saltando seed.");
                    return;
                }
            }

            // Intentamos leer configuración estructurada: Seed:Admin:Username
            var adminSection = configuration.GetSection("Seed:Admin");
            var username = adminSection["Username"];
            var email = adminSection["Email"];
            var password = adminSection["Password"];

            // Fallback a variables de entorno simples (por compatibilidad con .env)
            username ??= configuration["SEED_ADMIN_USERNAME"] ?? "admin";
            email ??= configuration["SEED_ADMIN_EMAIL"] ?? "admin@local.host";
            password ??= configuration["SEED_ADMIN_PASSWORD"] ?? "Admin123!";

            // Hash de la contraseña usando BCrypt (requiere BCrypt.Net-Next en el proyecto Infrastructure)
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

            var admin = new User
            {
                Username = username,
                Email = email,
                PasswordHash = passwordHash,
                FirstName = "Admin",
                LastName = "User",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                Roles = new List<string> { "admin" }
            };

            db.Set<User>().Add(admin);
            await db.SaveChangesAsync();

            logger.LogInformation("Usuario admin creado por seed: {Username}", username);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error ejecutando el DbSeeder");
            throw;
        }
    }
}
