using Rasyonet_Intern.API.DTOs;
using Rasyonet_Intern.API.Documents;

namespace Rasyonet_Intern.API.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        Task<List<CategoryDocument>> GetAllAsync();
        Task<List<CategoryChartDto>> GetChartData();
    }
}
