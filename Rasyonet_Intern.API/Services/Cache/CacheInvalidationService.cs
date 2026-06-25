namespace Rasyonet_Intern.API.Services.Cache
{
    public class CacheInvalidationService
    {
        private readonly CacheService _cacheService;
        private readonly ILogger<CacheInvalidationService> _logger;

        public CacheInvalidationService(CacheService cacheService, ILogger<CacheInvalidationService> logger)
        {
            _cacheService = cacheService;
            _logger = logger;
        }

        // MongoDB Change Stream tarafında bir collection değiştiğinde çağrılır.
        public void InvalidateSalesCharts()
        {
            // Sales collection değiştiyse, Sales verisine bağlı bütün chart cache key'lerini temizle.
            foreach (var key in CacheKeys.SalesChartKeys)
            {
                _cacheService.Remove(key);
            }
            _logger.LogInformation("Sales chart cache'leri temizlendi.");
        }
    }
}
