using Rasyonet_Intern.API.Models;

namespace Rasyonet_Intern.API.Repository
{
public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync();
    Task<Category> GetByIdAsync(string id);
    Task AddPerformanceAsync(string categoryId, Performance performance);
}
}
