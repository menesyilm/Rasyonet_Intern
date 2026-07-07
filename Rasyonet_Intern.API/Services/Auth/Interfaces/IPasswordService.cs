using Rasyonet_Intern.API.Documents;

namespace Rasyonet_Intern.API.Services.Auth.Interfaces
{
    public interface IPasswordService
    {
        string HashPassword(UserDocument user, string password);
        bool VerifyPassword(UserDocument user, string password);
    }
}