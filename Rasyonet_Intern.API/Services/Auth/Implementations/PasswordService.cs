using Microsoft.AspNetCore.Identity;
using Rasyonet_Intern.API.Documents;
using Rasyonet_Intern.API.Services.Auth.Interfaces;

namespace Rasyonet_Intern.API.Services.Auth.Implementations
{
    public class PasswordService : IPasswordService
    {
        private readonly PasswordHasher<UserDocument> _passwordHasher = new();

        public string HashPassword(UserDocument user, string password)
        {
            return _passwordHasher.HashPassword(user, password);
        }

        public bool VerifyPassword(UserDocument user, string password)
        {
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            return result == PasswordVerificationResult.Success || result == PasswordVerificationResult.SuccessRehashNeeded;
        }
    }
}