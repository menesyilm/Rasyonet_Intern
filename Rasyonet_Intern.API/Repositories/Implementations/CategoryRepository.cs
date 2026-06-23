using MongoDB.Driver;
using Rasyonet_Intern.API.Data;
using Rasyonet_Intern.API.DTOs;
using Rasyonet_Intern.API.Documents;
using Rasyonet_Intern.API.Repositories.Interfaces;

namespace Rasyonet_Intern.API.Repositories.Implementations
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly IMongoCollection<CategoryDocument> _categoryCollection;

        public CategoryRepository(MongoDbContext context)
        {
            _categoryCollection = context.Categories;
        }

        public async Task<List<CategoryDocument>> GetAllAsync()
        {
            return await _categoryCollection.Find(_ => true).ToListAsync();
        }
        public async Task<List<CategoryChartDto>> GetChartData()
        {
            var categories = await _categoryCollection.Find(_ => true).ToListAsync();

            var result = categories.Select(c => new CategoryChartDto
            {
                Category = c.CategoryName,
                Value = c.Performances.Sum(x => x.Value)
            }).ToList();

            return result;
        }


    }
}
