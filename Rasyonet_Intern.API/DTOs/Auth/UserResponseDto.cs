namespace Rasyonet_Intern.API.DTOs.Auth
{
    public class UserResponseDto
    {
        public string Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Surname { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;

    }
}