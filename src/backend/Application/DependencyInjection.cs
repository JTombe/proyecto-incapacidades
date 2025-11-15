using Incapacidades.Application.Interfaces;
using Incapacidades.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Incapacidades.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IIncapacidadService, IncapacidadService>();
        services.AddScoped<IEmpleadoService, EmpleadoService>();
        return services;
    }
}

