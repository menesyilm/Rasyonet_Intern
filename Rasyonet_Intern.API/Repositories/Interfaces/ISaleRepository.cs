using Rasyonet_Intern.API.DTOs;
using Rasyonet_Intern.API.Documents;

namespace Rasyonet_Intern.API.Repositories.Interfaces
{
    public interface ISaleRepository
    {
        Task<List<SaleDocument>> GetAllAsync();
        Task<SaleDocument> GetByIdAsync(string id);
        Task<List<StoreLocationSalesDto>> GetSalesByStoreLocationAsync();
        Task<List<PurchaseMethodDistributionDto>> GetSalesByPurchaseMethodAsync();
        Task<List<MonthlySalesTrendDto>> GetMonthlySalesTrendAsync();
    }
}
