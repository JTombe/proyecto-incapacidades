using System.Linq;

namespace Incapacidades.Shared.Responses;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string> Errors { get; set; } = new();

    public static ApiResponse<T> SuccessResponse(T data, string message = "")
        => new()
        {
            Success = true,
            Message = message,
            Data = data
        };

    public static ApiResponse<T> FailureResponse(IEnumerable<string> errors, string message = "")
        => new()
        {
            Success = false,
            Message = message,
            Errors = errors.ToList()
        };

    public static ApiResponse<T> FailureResponse(string error, string message = "")
        => FailureResponse(new[] { error }, message);
}

