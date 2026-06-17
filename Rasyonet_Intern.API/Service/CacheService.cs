using Microsoft.Extensions.Caching.Memory;

namespace Rasyonet_Intern.API.Service
{
    public class CacheService
    {
        private readonly IMemoryCache _cache;
        private readonly ILogger<CacheService> _logger;

        public CacheService(IMemoryCache cache, ILogger<CacheService> logger)
        {
            _cache = cache;
            _logger = logger;
        }

        public async Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> factory)
        {
            if (!_cache.TryGetValue(key, out T? value))
            {
                value = await factory();

                var options = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow =
                        TimeSpan.FromMinutes(10)
                };

                _cache.Set(key, value, options);

                _logger.LogInformation("{Key} MongoDB'den geldi ve cache'e eklendi.",key);
            }
            else
            {
                _logger.LogInformation("{Key} cache'den geldi.",key);
            }

            return value!;
        }
    }
}