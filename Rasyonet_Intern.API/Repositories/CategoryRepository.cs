using MongoDB.Bson;
using MongoDB.Driver;
using Rasyonet_Intern.API.Data;
using Rasyonet_Intern.API.DTOs;
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

        public async Task<List<CategoryChartDto>> GetChartData()
        {
            var categories = await _collection.Find(_ => true).ToListAsync();

            var result = categories.Select(c => new CategoryChartDto
            {
                Category = c.CategoryName,
                Value = c.Performances.Sum(x => x.Value)
            }).ToList();

            return result;
        }
    }
}
