using Incapacidades.Domain.Enums;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Incapacidades.API.Contracts.Requests;

public class RegistrarIncapacidadFormRequest
{
    [Required]
    public int EmpleadoId { get; set; }

    public string? EmpleadoNombre { get; set; }

    [Required]
    public TipoIncapacidad Tipo { get; set; }

    [Required]
    public DateTime FechaInicio { get; set; }

    [Range(1, 365)]
    public int Dias { get; set; }

    [Required]
    [StringLength(512)]
    public string Diagnostico { get; set; } = string.Empty;

    [Required]
    [StringLength(128)]
    public string EPS { get; set; } = string.Empty;

    public List<TipoDocumento>? TiposDocumentos { get; set; }

    public IFormFile[]? Documentos { get; set; }
}

