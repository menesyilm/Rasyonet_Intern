using System.ComponentModel.DataAnnotations;

namespace Rasyonet_Intern.API.DTOs.Auth
{
    public class RegisterRequestDto
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = String.Empty;

        [Required]
        [MaxLength(50)]
        public string Surname { get; set; } = String.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = String.Empty;

        [Required]
        [MinLength(6)]
        [MaxLength(50)]
        public string Password { get; set; } = String.Empty;
    }
}