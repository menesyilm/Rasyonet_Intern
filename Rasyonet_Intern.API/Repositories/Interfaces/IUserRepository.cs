using Rasyonet_Intern.API.Documents;

namespace Rasyonet_Intern.API.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<IReadOnlyList<UserDocument>> GetAllAsync();
        Task<UserDocument?> GetByEmailAsync(string email);
        Task<UserDocument?> GetByIdAsync(string id);
        Task<bool> ExistsByEmailAsync (string email);
        Task CreateAsync(UserDocument user);
    }
}
