using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Incapacidades.Application.Models.Users;
using Incapacidades.Application.Interfaces.Repositories;
using Incapacidades.Domain.Entities;
using BCrypt.Net;

namespace Incapacidades.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "GestionHumana")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public UsersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
    {
        var users = await _userRepository.GetAllAsync();
        var userDtos = users.Select(u => MapToDto(u));
        return Ok(userDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetById(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            return NotFound();

        return Ok(MapToDto(user));
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> Create(CreateUserDto createDto)
    {
        if (await _userRepository.ExistsByUsernameAsync(createDto.Username))
            return BadRequest("El nombre de usuario ya está en uso");

        if (await _userRepository.ExistsByEmailAsync(createDto.Email))
            return BadRequest("El correo electrónico ya está registrado");

        var user = new User
        {
            Username = createDto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(createDto.Password),
            Email = createDto.Email,
            FirstName = createDto.FirstName,
            LastName = createDto.LastName,
            Roles = createDto.Roles,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.CreateAsync(user);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, MapToDto(user));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateUserDto updateDto)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            return NotFound();

        if (updateDto.Email != null)
        {
            if (await _userRepository.ExistsByEmailAsync(updateDto.Email) && user.Email != updateDto.Email)
                return BadRequest("El correo electrónico ya está registrado por otro usuario");
            user.Email = updateDto.Email;
        }

        if (updateDto.FirstName != null)
            user.FirstName = updateDto.FirstName;
        
        if (updateDto.LastName != null)
            user.LastName = updateDto.LastName;
        
        if (updateDto.IsActive.HasValue)
            user.IsActive = updateDto.IsActive.Value;
        
        if (updateDto.Roles != null)
            user.Roles = updateDto.Roles;

        await _userRepository.UpdateAsync(user);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!await _userRepository.ExistsAsync(id))
            return NotFound();

        await _userRepository.DeleteAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/change-password")]
    public async Task<IActionResult> ChangePassword(int id, ChangePasswordDto changePasswordDto)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            return NotFound();

        if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.PasswordHash))
            return BadRequest("La contraseña actual es incorrecta");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
        await _userRepository.UpdateAsync(user);
        return NoContent();
    }

    private static UserDto MapToDto(User user) => new()
    {
        Id = user.Id,
        Username = user.Username,
        Email = user.Email,
        FirstName = user.FirstName,
        LastName = user.LastName,
        IsActive = user.IsActive,
        CreatedAt = user.CreatedAt,
        LastLogin = user.LastLogin,
        Roles = user.Roles
    };
}