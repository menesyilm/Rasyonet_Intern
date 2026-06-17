using Rasyonet_Intern.API.DTOs;
using Rasyonet_Intern.API.Models;

namespace Rasyonet_Intern.API.Repository
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetAllAsync();
        Task<List<CategoryChartDto>> GetChartData();
    }
}
