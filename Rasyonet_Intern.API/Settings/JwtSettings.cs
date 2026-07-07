namespace Rasyonet_Intern.API.Settings
{
    // JwtSettings sınıfı, JWT ile ilgili ayarları temsil eder.
    // Bu sınıf doğrudan token üretmez.
    // Sadece appsettings.json içindeki JWT ayarlarını C# tarafında taşımak için kullanılır.
    public class JwtSettings
    {
        public string Issuer { get; set; } = String.Empty;
        public string Audience { get; set; } = String.Empty;
        public string SecretKey { get; set; } = String.Empty;
        public int ExpirationInMinutes { get; set; }
    }
}