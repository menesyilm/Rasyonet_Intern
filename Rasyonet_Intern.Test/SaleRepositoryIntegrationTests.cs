using MongoDB.Bson;
using MongoDB.Driver;
using Rasyonet_Intern.API.Data;
using Rasyonet_Intern.API.Models;
using Rasyonet_Intern.API.Repositories.Implementations;

namespace Rasyonet_Intern.Test.IntegrationTests
{
    public class SaleRepositoryIntegrationTests
    {
        private const string ConnectionString = "mongodb://localhost:27017";

        //Test için oluşturulacak geçici database adı.
        private string _databaseName = string.Empty;
        //MongoDB'ye bağlanmak için kullanılan client.
        private MongoClient _mongoClient = null!;
        //Testin kullanacağı MongoDB database nesnesi.
        private IMongoDatabase _database = null!;
        //Test edeceğimiz SaleRepository nesnesi.
        private SaleRepository _repository = null!;

        //Testten önce çalışacak setup metodu. Geçici bir database oluşturur ve test verilerini ekler.
        [SetUp]
        public async Task SetUp()
        {
            _databaseName = $"Rasyonet_Intern_Test_{Guid.NewGuid():N}";
            _mongoClient = new MongoClient(ConnectionString);
            _database = _mongoClient.GetDatabase(_databaseName);

            var context = new MongoDbContext(_database);
            _repository = new SaleRepository(context);
            //SaleRepository -> MongoDbContext -> Test MongoDB Database
            await context.Sales.InsertManyAsync(CreateTestSales());
            //Test başlamadan önce MongoDB’ye sahte ama kontrollü satış verileri ekliyoruz.
        }

        //Testten sonra çalışacak teardown metodu. Geçici database'i siler.
        [TearDown]
        public async Task TearDown()
        {
            if (_mongoClient != null && !string.IsNullOrWhiteSpace(_databaseName))
            {
                await _mongoClient.DropDatabaseAsync(_databaseName);
                _mongoClient.Dispose();
            }
        }

        //burada endpoint’i değil, endpoint’in arkasında kullanılan veri erişim metodunu test ediyoruz.
        //Test metodu. Satış verilerine göre gruplandırılmış toplamları döndürür.
        // SaleRepository.GetSalesByStoreLocationAsync metodunun MongoDB'deki satislari
        // magazaya gore gruplayip toplam satis tutari ve siparis sayisini dogru hesapladigini test eder.
        [Test]
        public async Task GetSalesByStoreLocationAsync_WhenSalesExist_ShouldReturnGroupedTotals()
        {
            var result = await _repository.GetSalesByStoreLocationAsync();

            var istanbul = result.Single(x => x.StoreLocation == "Istanbul");
            var ankara = result.Single(x => x.StoreLocation == "Ankara");

            Assert.That(result, Has.Count.EqualTo(2));
            Assert.That(istanbul.TotalSales, Is.EqualTo(250m));
            Assert.That(istanbul.OrderCount, Is.EqualTo(2));
            Assert.That(ankara.TotalSales, Is.EqualTo(80m));
            Assert.That(ankara.OrderCount, Is.EqualTo(1));
        }

        // SaleRepository.GetSalesByPurchaseMethodAsync metodunun MongoDB'deki satislari
        // satin alma yontemine gore gruplayip toplam satis tutari ve siparis sayisini dogru hesapladigini test eder.
        [Test]
        public async Task GetSalesByPurchaseMethodAsync_WhenSalesExist_ShouldReturnGroupedTotals()
        {
            var result = await _repository.GetSalesByPurchaseMethodAsync();

            var online = result.Single(x => x.PurchaseMethod == "Online");
            var inStore = result.Single(x => x.PurchaseMethod == "In store");

            Assert.That(result, Has.Count.EqualTo(2));
            Assert.That(online.TotalSales, Is.EqualTo(280m));
            Assert.That(online.OrderCount, Is.EqualTo(2));
            Assert.That(inStore.TotalSales, Is.EqualTo(50m));
            Assert.That(inStore.OrderCount, Is.EqualTo(1));
        }

        // SaleRepository.GetMonthlySalesTrendAsync metodunun MongoDB'deki satislari
        // yil ve aya gore gruplayip aylik toplam satis tutarini dogru hesapladigini test eder.
        [Test]
        public async Task GetMonthlySalesTrendAsync_WhenSalesExist_ShouldReturnMonthlyTotals()
        {
            var result = await _repository.GetMonthlySalesTrendAsync();

            var january = result.Single(x => x.Period == "2026-01");
            var february = result.Single(x => x.Period == "2026-02");

            Assert.That(result, Has.Count.EqualTo(2));
            Assert.That(january.TotalSales, Is.EqualTo(250m));
            Assert.That(january.OrderCount, Is.EqualTo(2));
            Assert.That(february.TotalSales, Is.EqualTo(80m));
            Assert.That(february.OrderCount, Is.EqualTo(1));
        }

        //MongoDB'ye eklenen sahte satış verilerini oluşturur.
        private static List<Sale> CreateTestSales()
        {
            return new List<Sale>
            {
                new()
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    SaleDate = new DateTime(2026, 1, 10),
                    StoreLocation = "Istanbul",
                    PurchaseMethod = "Online",
                    Customer = new SaleCustomer
                    {
                        Gender = "Female",
                        Age = 25,
                        Email = "customer1@test.com",
                        Satisfaction = 5
                    },
                    Items = new List<SaleItem>
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
                    Customer = new SaleCustomer
                    {
                        Gender = "Male",
                        Age = 31,
                        Email = "customer2@test.com",
                        Satisfaction = 4
                    },
                    Items = new List<SaleItem>
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
                    Customer = new SaleCustomer
                    {
                        Gender = "Female",
                        Age = 29,
                        Email = "customer3@test.com",
                        Satisfaction = 5
                    },
                    Items = new List<SaleItem>
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
