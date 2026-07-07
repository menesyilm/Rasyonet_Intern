namespace Rasyonet_Intern.API.Settings
{
    public class JwtSettings
    {
        public string Issuer { get; set; } = String.Empty;
        public string Audience { get; set; } = String.Empty;
        public string SecretKey { get; set; } = String.Empty;
        public int ExpirationInMinutes { get; set; }
    }
}