using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Rasyonet_Intern.API.Models;

namespace Rasyonet_Intern.API.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IMongoDatabase database)
        {
            _database = database;
        }

        public IMongoCollection<Category> Categories =>
            _database.GetCollection<Category>("Categories");
        public IMongoCollection<Sale> Sales =>
            _database.GetCollection<Sale>("Sales");
    }
}
