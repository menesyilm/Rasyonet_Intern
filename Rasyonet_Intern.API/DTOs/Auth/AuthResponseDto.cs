namespace Rasyonet_Intern.API.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string AccessToken { get; set; } = String.Empty;
        public DateTime ExpiresAt { get; set; }
        public UserResponseDto User { get; set; } = new UserResponseDto();
    }
}