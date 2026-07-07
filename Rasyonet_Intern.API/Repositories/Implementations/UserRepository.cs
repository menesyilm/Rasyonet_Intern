using MongoDB.Driver;
using Rasyonet_Intern.API.Data;
using Rasyonet_Intern.API.Documents;
using Rasyonet_Intern.API.Repositories.Interfaces;

namespace Rasyonet_Intern.API.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        // MongoDbContext, MongoDB collection'larına erişmemizi sağlayan sınıftır.
        // Örneğin _context.Users ile Users collection'ına ulaşırız.
        private readonly MongoDbContext _context;
        public UserRepository(MongoDbContext context)
        {
            _context = context;
        }

        // Yeni kullanıcıyı MongoDB Users collection'ına ekler.
        // Register işlemi sırasında AuthService burayı çağırır.
        public async Task CreateAsync(UserDocument user)
        {
            await _context.Users.InsertOneAsync(user);
        }
        // Sistemdeki tüm kullanıcıları getirir.
        // IReadOnlyList dönmemizin sebebi:
        // Bu liste dışarıdan değiştirilmesin, sadece okunsun.
        public async Task<IReadOnlyList<UserDocument>> GetAllAsync()
        {
            return await _context.Users
                .Find(Builders<UserDocument>.Filter.Empty)
                .SortByDescending(x => x.CreatedAt)
                .ToListAsync();
        }
        // Verilen email adresine sahip kullanıcı var mı diye kontrol eder.
        // Register sırasında aynı email ile tekrar kayıt olunmasını engellemek için kullanılır.
        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _context.Users
                .Find(x => x.Email == email)
                .AnyAsync();
        }
        // Verilen email adresine sahip kullanıcıyı getirir.
        // Login sırasında kullanılır.
        public async Task<UserDocument?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .Find(x => x.Email == email)
                .FirstOrDefaultAsync();
        }
        // Verilen MongoDB Id değerine sahip kullanıcıyı getirir.
        // Token içindeki userId ile kullanıcıyı bulmak için kullanılabilir.
        public async Task<UserDocument?> GetByIdAsync(string id)
        {
            return await _context.Users
                .Find(x => x.Id == id)
                .FirstOrDefaultAsync();
        }
    }
}
