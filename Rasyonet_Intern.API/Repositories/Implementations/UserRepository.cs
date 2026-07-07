using MongoDB.Driver;
using Rasyonet_Intern.API.Data;
using Rasyonet_Intern.API.Documents;
using Rasyonet_Intern.API.Repositories.Interfaces;

namespace Rasyonet_Intern.API.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly MongoDbContext _context;
        public UserRepository(MongoDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(UserDocument user)
        {
            await _context.Users.InsertOneAsync(user);
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _context.Users
                .Find(x => x.Email == email)
                .AnyAsync();
        }

        public async Task<UserDocument?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .Find(x => x.Email == email)
                .FirstOrDefaultAsync();
        }

        public async Task<UserDocument?> GetByIdAsync(string id)
        {
            return await _context.Users
                .Find(x => x.Id == id)
                .FirstOrDefaultAsync();
        }
    }
}
