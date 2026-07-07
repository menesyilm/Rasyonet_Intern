using Rasyonet_Intern.API.DTOs.Auth;

namespace Rasyonet_Intern.API.Services.Auth.Interfaces
{
    public interface IAuthService
    {
        Task<IReadOnlyList<UserResponseDto>> GetAllUsersAsync();
        Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
        Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
    }
}
