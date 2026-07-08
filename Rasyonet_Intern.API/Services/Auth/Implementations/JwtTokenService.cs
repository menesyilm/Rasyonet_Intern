using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Rasyonet_Intern.API.Documents;
using Rasyonet_Intern.API.Services.Auth.Interfaces;
using Rasyonet_Intern.API.Settings;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Rasyonet_Intern.API.Services.Auth.Implementations
{
    // Bu sınıf JWT token üretmekten sorumludur.
    public class JwtTokenService : IJwtTokenService
    {
        // appsettings.json içindeki JWT ayarlarını tutar.
        // SecretKey, Issuer, Audience, ExpirationInMinutes gibi bilgiler buradan gelir.
        private readonly JwtSettings _jwtSettings;
        // IOptions<JwtSettings>, appsettings.json içindeki JwtSettings bölümünü
        // strongly typed şekilde bu sınıfa enjekte eder.
        public JwtTokenService(IOptions<JwtSettings> jwtOptions)
        {
            // jwtOptions.Value bize gerçek JwtSettings nesnesini verir.
            _jwtSettings = jwtOptions.Value;
        }

        // Bu metot kullanıcı bilgisine göre JWT token üretir.
        // out DateTime expiresAt ile token'ın ne zaman biteceğini dışarıya döndürür.
        public string GenerateToken(UserDocument user, out DateTime expiresAt)
        {
            // Token'ın geçerlilik süresi hesaplanır.
            // UTC kullanmak önemlidir çünkü sunucu saat farklarından etkilenmemek gerekir.
            expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes);
            if (string.IsNullOrWhiteSpace(user.Id))
                throw new InvalidOperationException("Token üretmek için kullanıcı Id bilgisi zorunludur.");

            if (string.IsNullOrWhiteSpace(user.Email))
                throw new InvalidOperationException("Token üretmek için kullanıcı email bilgisi zorunludur.");
            // Claim, token içine yazılan kullanıcı bilgileridir.
            var claims = new List<Claim>
            {
                // Kullanıcının unique Id bilgisini token'a koyuyoruz.
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                // Kullanıcının email bilgisini token'a koyuyoruz.
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
            };
            // SecretKey string olarak appsettings.json'da durur.
            // JWT imzalamak için byte array'e çevrilmesi gerekir.
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            // Token hangi algoritma ile imzalanacak onu belirliyoruz.
            // HmacSha256 en yaygın simetrik JWT imzalama algoritmalarından biridir.
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            // JWT token'ın kendisini oluşturuyoruz.
            var token = new JwtSecurityToken(
                // Token'ı kim üretti?
                // Örneğin: "Rasyonet_Intern_API"
                issuer: _jwtSettings.Issuer,

                // Token kimin için üretildi?
                // Örneğin: "Rasyonet_Intern_Mobile"
                audience: _jwtSettings.Audience,

                // Token içinde taşınacak kullanıcı bilgileri
                claims: claims,

                // Token'ın son geçerlilik zamanı
                expires: expiresAt,

                // Token'ın güvenli şekilde imzalanmasını sağlayan bilgiler
                signingCredentials: credentials
            );

            // JwtSecurityToken nesnesini string token formatına çeviriyoruz.
            // Frontend/mobile tarafına dönen değer budur.
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
