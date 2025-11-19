using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;
using Incapacidades.Domain.Entities;
using Incapacidades.Application.Interfaces.Repositories;
using Microsoft.Extensions.Configuration;

namespace Incapacidades.Infrastructure.Services;

public interface IAuthService
{
    Task<(bool success, string token, User? user, string message)> LoginAsync(string email, string password);
    Task<(bool success, User? user, string message)> RegisterAsync(string username, string email, string password, string firstName, string lastName);
    string GenerateJwtToken(User user, IConfiguration configuration);
}

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;

    public AuthService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<(bool success, string token, User? user, string message)> LoginAsync(string email, string password)
    {
        // Buscar usuario por email
        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null)
            return (false, string.Empty, null, "Usuario no encontrado");

        // Verificar contraseña
        if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            return (false, string.Empty, null, "Contraseña incorrecta");

        if (!user.IsActive)
            return (false, string.Empty, null, "Usuario inactivo");

        // Actualizar último acceso
        user.LastLogin = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        return (true, string.Empty, user, "Login exitoso");
    }

    public async Task<(bool success, User? user, string message)> RegisterAsync(string username, string email, string password, string firstName, string lastName)
    {
        // Validar que el usuario no exista
        if (await _userRepository.ExistsByUsernameAsync(username))
            return (false, null, "El nombre de usuario ya está en uso");

        if (await _userRepository.ExistsByEmailAsync(email))
            return (false, null, "El correo electrónico ya está registrado");

        // Crear nuevo usuario
        var user = new User
        {
            Username = username,
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            FirstName = firstName,
            LastName = lastName,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            Roles = new List<string> { "empleado" }
        };

        await _userRepository.CreateAsync(user);
        return (true, user, "Registro exitoso");
    }

    public string GenerateJwtToken(User user, IConfiguration configuration)
    {
        var jwtSection = configuration.GetSection("Jwt");
        var secret = jwtSection["Secret"] ?? "TemporalSecretKeyParaDesarrollo123!";
        var key = Encoding.ASCII.GetBytes(secret);
        var issuer = jwtSection["Issuer"] ?? "Incapacidades.Api";
        var audience = jwtSection["Audience"] ?? "Incapacidades.Clientes";

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim("FirstName", user.FirstName ?? string.Empty),
            new Claim("LastName", user.LastName ?? string.Empty)
        };

        // Agregar roles como claims
        foreach (var role in user.Roles ?? new List<string>())
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(24),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
