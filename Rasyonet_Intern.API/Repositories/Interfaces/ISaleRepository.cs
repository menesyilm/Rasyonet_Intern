using Rasyonet_Intern.API.DTOs;
using Rasyonet_Intern.API.Models;

namespace Rasyonet_Intern.API.Repositories.Interfaces
{
    public interface ISaleRepository
    {
        Task<List<Sale>> GetAllAsync();
        Task<Sale> GetByIdAsync(string id);
        Task<List<StoreLocationSalesDto>> GetSalesByStoreLocationAsync();
        Task<List<PurchaseMethodDistributionDto>> GetSalesByPurchaseMethodAsync();
        Task<List<MonthlySalesTrendDto>> GetMonthlySalesTrendAsync();
    }
}
