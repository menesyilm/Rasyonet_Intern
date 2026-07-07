using Rasyonet_Intern.API.Documents;

namespace Rasyonet_Intern.API.Services.Auth.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateToken(UserDocument user, out DateTime expiresAt);
    }
}
