using Microsoft.AspNetCore.Mvc;
using Rasyonet_Intern.API.Repositories.Interfaces;
using Rasyonet_Intern.API.Services.Cache;

namespace Rasyonet_Intern.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly ISaleRepository _repository;
        private readonly CacheService _cacheService;
        public SalesController(ISaleRepository repository, CacheService cacheService)
        {
            _repository = repository;
            _cacheService = cacheService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _repository.GetAllAsync();
            return Ok(result);
        }
        [HttpGet("{GetById}")]
        public async Task<IActionResult> GetById(string id)
        {
            var result = await _repository.GetByIdAsync(id);
            if (result == null)
                return NotFound();
            return Ok(result);
        }
        // BAR CHART verisi
        [HttpGet("chart/by-store-location")]
        public async Task<IActionResult> GetByStoreLocation()
        {
            var result = await _cacheService.GetOrSetAsync(CacheKeys.StoreLocationChart, () => _repository.GetSalesByStoreLocationAsync());
            return Ok(result);
        }

        // PIE CHART verisi
        [HttpGet("chart/by-purchase-method")]
        public async Task<IActionResult> GetByPurchaseMethod()
        {
            var result = await _cacheService.GetOrSetAsync(CacheKeys.PurchaseMethodChart, () => _repository.GetSalesByPurchaseMethodAsync());
            return Ok(result);
        }

        // LINE CHART verisi
        [HttpGet("chart/monthly-trend")]
        public async Task<IActionResult> GetMonthlyTrend()
        {
            var result = await _cacheService.GetOrSetAsync(CacheKeys.MonthlyTrendChart, () => _repository.GetMonthlySalesTrendAsync());
            return Ok(result);
        }
    }
}
