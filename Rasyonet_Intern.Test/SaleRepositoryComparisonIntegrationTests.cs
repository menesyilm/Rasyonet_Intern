using MongoDB.Bson;
using MongoDB.Driver;
using Rasyonet_Intern.API.Data;
using Rasyonet_Intern.API.Documents;
using Rasyonet_Intern.API.Repositories.Implementations;

namespace Rasyonet_Intern.Test.IntegrationTests
{
    public class SaleRepositoryComparisonIntegrationTests
    {
        private const string ConnectionString = "mongodb://localhost:27017";
        private string _databaseName = string.Empty;
        private MongoClient _mongoClient = null!;
        private SaleRepository _repository = null!;
        private List<SaleDocument> _testSales = new();

        [SetUp]
        public async Task SetUp()
        {
            _databaseName = $"Rasyonet_Cmp_Test_{Guid.NewGuid():N}";
            _mongoClient = new MongoClient(ConnectionString);

            var database = _mongoClient.GetDatabase(_databaseName);
            var context = new MongoDbContext(database);

            _repository = new SaleRepository(context);
            _testSales = CreateTestSales();

            await context.Sales.InsertManyAsync(_testSales);
        }

        [TearDown]
        public async Task TearDown()
        {
            if (_mongoClient != null && !string.IsNullOrWhiteSpace(_databaseName))
            {
                await _mongoClient.DropDatabaseAsync(_databaseName);
                _mongoClient.Dispose();
            }
        }

        // Karsilastirma testi:
        // 1. Actual result: SaleRepository MongoDB aggregation sonucu.
        // 2. Expected result: Ayni test verisinin C# LINQ ile manuel hesaplanmis sonucu.
        // Bu test controller veya endpoint test etmez; repository + MongoDB birlikte calistigi icin Integration Test'tir.
        [Test]
        public async Task GetSalesByStoreLocationAsync_ShouldMatchManuallyCalculatedTotals()
        {
            var actualResult = await _repository.GetSalesByStoreLocationAsync();

            var expectedResult = _testSales
                .GroupBy(sale => sale.StoreLocation)
                .Select(group => new
                {
                    StoreLocation = group.Key,
                    TotalSales = group.Sum(sale =>
                        sale.Items.Sum(item => item.Price * item.Quantity)),
                    OrderCount = group.Count()
                })
                .ToList();

            Assert.That(actualResult, Has.Count.EqualTo(expectedResult.Count));

            foreach (var expected in expectedResult)
            {
                var actual = actualResult.Single(result =>
                    result.StoreLocation == expected.StoreLocation);

                Assert.That(actual.TotalSales, Is.EqualTo(expected.TotalSales));
                Assert.That(actual.OrderCount, Is.EqualTo(expected.OrderCount));
            }
        }

        private static List<SaleDocument> CreateTestSales()
        {
            return new List<SaleDocument>
            {
                new()
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    SaleDate = new DateTime(2026, 1, 10),
                    StoreLocation = "Istanbul",
                    PurchaseMethod = "Online",
                    Customer = new SaleCustomerDocument
                    {
                        Gender = "Female",
                        Age = 25,
                        Email = "customer1@test.com",
                        Satisfaction = 5
                    },
                    Items = new List<SaleItemDocument>
                    {
                        new()
                        {
                            Name = "Notebook",
                            Price = 100m,
                            Quantity = 2,
                            Tags = new List<string> { "office" }
                        }
                    }
                },
                new()
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    SaleDate = new DateTime(2026, 1, 15),
                    StoreLocation = "Istanbul",
                    PurchaseMethod = "In store",
                    Customer = new SaleCustomerDocument
                    {
                        Gender = "Male",
                        Age = 31,
                        Email = "customer2@test.com",
                        Satisfaction = 4
                    },
                    Items = new List<SaleItemDocument>
                    {
                        new()
                        {
                            Name = "Pen",
                            Price = 50m,
                            Quantity = 1,
                            Tags = new List<string> { "office" }
                        }
                    }
                },
                new()
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    SaleDate = new DateTime(2026, 2, 5),
                    StoreLocation = "Ankara",
                    PurchaseMethod = "Online",
                    Customer = new SaleCustomerDocument
                    {
                        Gender = "Female",
                        Age = 29,
                        Email = "customer3@test.com",
                        Satisfaction = 5
                    },
                    Items = new List<SaleItemDocument>
                    {
                        new()
                        {
                            Name = "Bag",
                            Price = 80m,
                            Quantity = 1,
                            Tags = new List<string> { "accessory" }
                        }
                    }
                }
            };
        }
    }
}
