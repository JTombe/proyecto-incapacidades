using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Incapacidades.Application.Models.Auth;
using Incapacidades.Infrastructure.Services;

namespace Incapacidades.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IConfiguration _configuration;

    public AuthController(IAuthService authService, IConfiguration configuration)
    {
        _authService = authService;
        _configuration = configuration;
    }

    /// <summary>
    /// Endpoint de login: autentica usuario y devuelve JWT
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new AuthResponseDto { Success = false, Message = "Datos inválidos" });

        var (success, _, user, message) = await _authService.LoginAsync(loginDto.Email, loginDto.Password);

        if (!success || user is null)
            return Unauthorized(new AuthResponseDto { Success = false, Message = message });

        // Generar JWT
        var token = _authService.GenerateJwtToken(user, _configuration);

        return Ok(new AuthResponseDto
        {
            Success = true,
            Message = "Login exitoso",
            Token = token,
            User = new UserAuthDto
            {
                Id = user!.Id,
                Username = user!.Username,
                Email = user!.Email,
                FirstName = user!.FirstName ?? string.Empty,
                LastName = user!.LastName ?? string.Empty,
                Roles = user!.Roles ?? new List<string>()
            }
        });
    }

    /// <summary>
    /// Endpoint de registro: permite crear nuevo usuario sin autenticación previa
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new AuthResponseDto { Success = false, Message = "Datos inválidos" });

        // Validar que no esté vacío
        if (string.IsNullOrWhiteSpace(registerDto.Username) ||
            string.IsNullOrWhiteSpace(registerDto.Email) ||
            string.IsNullOrWhiteSpace(registerDto.Password) ||
            string.IsNullOrWhiteSpace(registerDto.FirstName) ||
            string.IsNullOrWhiteSpace(registerDto.LastName))
            return BadRequest(new AuthResponseDto { Success = false, Message = "Todos los campos son requeridos" });

        // Validar contraseña mínima
        if (registerDto.Password.Length < 6)
            return BadRequest(new AuthResponseDto { Success = false, Message = "La contraseña debe tener al menos 6 caracteres" });

        var (success, user, message) = await _authService.RegisterAsync(
            registerDto.Username,
            registerDto.Email,
            registerDto.Password,
            registerDto.FirstName,
            registerDto.LastName);

        if (!success || user is null)
            return BadRequest(new AuthResponseDto { Success = false, Message = message });

        // Generar JWT automáticamente después del registro
        var token = _authService.GenerateJwtToken(user, _configuration);

        return CreatedAtAction(nameof(Register), new AuthResponseDto
        {
            Success = true,
            Message = "Registro exitoso",
            Token = token,
            User = new UserAuthDto
            {
                Id = user!.Id,
                Username = user!.Username,
                Email = user!.Email,
                FirstName = user!.FirstName ?? string.Empty,
                LastName = user!.LastName ?? string.Empty,
                Roles = user!.Roles ?? new List<string>()
            }
        });
    }
}
