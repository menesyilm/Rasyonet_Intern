using MongoDB.Driver;
using Rasyonet_Intern.API.Documents;

namespace Rasyonet_Intern.API.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IMongoDatabase database)
        {
            _database = database;
        }
        public IMongoCollection<CategoryDocument> Categories =>
            _database.GetCollection<CategoryDocument>("Categories");
        public IMongoCollection<SaleDocument> Sales =>
            _database.GetCollection<SaleDocument>("Sales");
        public IMongoCollection<UserDocument> Users =>
            _database.GetCollection<UserDocument>("Users");
    }
}
