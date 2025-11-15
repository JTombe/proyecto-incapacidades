using Incapacidades.Application.DTOs.Requests;
using Incapacidades.Application.Interfaces;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Incapacidades.Infrastructure.Services;

public class LocalDocumentStorageService : IDocumentStorageService
{
    private readonly string _basePath;
    private readonly ILogger<LocalDocumentStorageService> _logger;

    public LocalDocumentStorageService(IHostEnvironment environment, ILogger<LocalDocumentStorageService> logger)
    {
        _logger = logger;
        _basePath = Path.Combine(environment.ContentRootPath, "storage", "incapacidades");
        Directory.CreateDirectory(_basePath);
    }

    public async Task<string> GuardarDocumentoAsync(Guid incapacidadId, DocumentoCargaRequest documento, CancellationToken cancellationToken = default)
    {
        var carpeta = Path.Combine(_basePath, incapacidadId.ToString());
        Directory.CreateDirectory(carpeta);

        var extension = ObtenerExtension(documento.Nombre, documento.ContentType);
        var nombreArchivo = $"{Guid.NewGuid()}{extension}";
        var rutaCompleta = Path.Combine(carpeta, nombreArchivo);

        await File.WriteAllBytesAsync(rutaCompleta, documento.Contenido, cancellationToken);
        _logger.LogInformation("Documento {Documento} almacenado para incapacidad {IncapacidadId}", nombreArchivo, incapacidadId);

        return Path.Combine("storage", "incapacidades", incapacidadId.ToString(), nombreArchivo).Replace("\\", "/");
    }

    private static string ObtenerExtension(string nombreArchivo, string contentType)
    {
        var extensionPorNombre = Path.GetExtension(nombreArchivo);
        if (!string.IsNullOrWhiteSpace(extensionPorNombre))
        {
            return extensionPorNombre;
        }

        return contentType switch
        {
            "application/pdf" => ".pdf",
            "image/png" => ".png",
            "image/jpeg" => ".jpg",
            "image/jpg" => ".jpg",
            _ => ".bin"
        };
    }
}

