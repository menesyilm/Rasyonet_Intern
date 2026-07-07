using Microsoft.AspNetCore.Identity;
using Rasyonet_Intern.API.Documents;
using Rasyonet_Intern.API.Services.Auth.Interfaces;

namespace Rasyonet_Intern.API.Services.Auth.Implementations
{
    // Bu sınıf şifre işlemlerinden sorumludur.
    // Register sırasında şifreyi hash'ler.
    // Login sırasında girilen şifreyi kayıtlı hash ile doğrular.
    public class PasswordService : IPasswordService
    {
        // Bu sınıf şifreyi güvenli şekilde hash'ler.
        private readonly PasswordHasher<UserDocument> _passwordHasher = new();

        // Register sırasında çalışır.
        // Kullanıcının düz metin şifresini alır ve hashlenmiş hale getirir.
        public string HashPassword(UserDocument user, string password)
        {
            return _passwordHasher.HashPassword(user, password);
        }

        // Login sırasında çalışır.
        // Kullanıcının girdiği şifre ile veritabanındaki hash karşılaştırılır.
        public bool VerifyPassword(UserDocument user, string password)
        {
            // user.PasswordHash veritabanında kayıtlı hashlenmiş şifredir.
            // password ise login ekranından gelen düz metin şifredir.
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);

            // Eğer sonuç Success ise şifre doğrudur.
            // Eğer SuccessRehashNeeded ise şifre doğrudur ama hash algoritması güncellenmiş olabilir.
            // Yani kullanıcı login olabilir, ama idealde hash yeniden üretilip DB'de güncellenmelidir.
            return result == PasswordVerificationResult.Success || result == PasswordVerificationResult.SuccessRehashNeeded;
        }
    }
}