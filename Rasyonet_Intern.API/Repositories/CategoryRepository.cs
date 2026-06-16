using MongoDB.Bson;
using MongoDB.Driver;
using Rasyonet_Intern.API.Data;
using Rasyonet_Intern.API.Models;

namespace Rasyonet_Intern.API.Repository
{
    public class CategoryRepository : ICategoryRepository
{
    private readonly IMongoCollection<Category> _collection;

    public CategoryRepository(MongoDbContext context)
    {
        _collection = context.Categories;
    }

    public async Task<List<Category>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }

    public async Task<Category> GetByIdAsync(string id)
    {
        return await _collection
            .Find(x => x.Id == ObjectId.Parse(id))
            .FirstOrDefaultAsync();
    }

    public async Task AddPerformanceAsync(string categoryId, Performance performance)
    {
        var filter = Builders<Category>.Filter
            .Eq(x => x.Id, ObjectId.Parse(categoryId));

        var update = Builders<Category>.Update
            .Push(x => x.Performances, performance);

        await _collection.UpdateOneAsync(filter, update);
    }
}
}
