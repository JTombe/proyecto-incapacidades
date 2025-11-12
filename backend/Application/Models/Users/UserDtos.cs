namespace Incapacidades.Application.Models.Users;

public record UserDto
{
    public int Id { get; init; }
    public string Username { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public bool IsActive { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? LastLogin { get; init; }
    public List<string> Roles { get; init; } = new();
}

public record CreateUserDto
{
    public string Username { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public List<string> Roles { get; init; } = new();
}

public record UpdateUserDto
{
    public string? Email { get; init; }
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public bool? IsActive { get; init; }
    public List<string>? Roles { get; init; }
}

public record ChangePasswordDto
{
    public string CurrentPassword { get; init; } = string.Empty;
    public string NewPassword { get; init; } = string.Empty;
}