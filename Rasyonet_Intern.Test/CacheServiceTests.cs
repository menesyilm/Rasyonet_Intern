using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using Rasyonet_Intern.API.Controllers;
using Rasyonet_Intern.API.DTOs;
using Rasyonet_Intern.API.Repositories.Interfaces;
using Rasyonet_Intern.API.Service;

namespace Rasyonet_Intern.Test
{
    public class Tests
    {
        // UnitOfWork_Condition_ExpectedResult
        // Cache'de veri bulunduğunda factory metodunun tekrar çalıştırılmadığını test eder.
        [Test]
        public async Task GetOrSetAsync_WhenCacheContainsValue_ShouldNotCallFactoryAgain()
        {
            // Arrange (Hazırlık)
            // Testin çalışması için tüm nesneleri oluşturuyoruz..
            var memoryCache = new MemoryCache(new MemoryCacheOptions());
            var loggerMock = new Mock<ILogger<CacheService>>();
            var service = new CacheService(memoryCache,loggerMock.Object);

            int callCount = 0;

            async Task<string> Factory()
            {
                callCount++;
                return "test";
            }

            // Act (Eylem)
            // Test etmek istediğin davranış.
            await service.GetOrSetAsync("sales", Factory);

            await service.GetOrSetAsync("sales", Factory);

            // Assert (Doğrulama)
            // Beklenti kontrol.
            Assert.That(callCount, Is.EqualTo(1));
        }
    }
}