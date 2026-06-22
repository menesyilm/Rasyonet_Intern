using MongoDB.Bson;
using MongoDB.Driver;
using Rasyonet_Intern.API.Data;
using Rasyonet_Intern.API.Models;
using Rasyonet_Intern.API.Repositories.Implementations;

namespace Rasyonet_Intern.Test.IntegrationTests
{
    public class SaleRepositoryIntegrationTests
    {
        //Local MongoDB bağlantı adresi.
        //Burada gerçek MongoDB server'a bağlanıyoruz ve mock kullanmıyoruz.
        private const string ConnectionString = "mongodb://localhost:27017";

        //Test için oluşturulacak geçici database adı.
        // Neden sabit "Rasyonet_Intern" database'ini kullanmıyoruz?
        // Çünkü gerçek uygulama verisi değişebilir.
        private string _databaseName = string.Empty;
        //MongoDB'ye bağlanmak için kullanılan gerçek client.
        private MongoClient _mongoClient = null!;
        //Testin kullanacağı gerçek MongoDB database nesnesi.
        private IMongoDatabase _database = null!;
        //Test edeceğimiz gerçek SaleRepository nesnesi.
        private SaleRepository _repository = null!;

        //Testten önce çalışacak setup metodu. Geçici bir database oluşturur ve test verilerini ekler.
        [SetUp]
        public async Task SetUp()
        {
            // Guid.NewGuid(): benzersiz değer üretir. 
            _databaseName = $"Rasyonet_Intern_Test_{Guid.NewGuid():N}";

            // Gerçek MongoDB client oluşturuluyor.
            _mongoClient = new MongoClient(ConnectionString);
            // MongoDB server içinden test için kullanılacak database referansı alınıyor.
            // İlk veri insert edildiğinde database/collection oluşur.
            _database = _mongoClient.GetDatabase(_databaseName);
            // Projedeki gerçek MongoDbContext oluşturuluyor.
            var context = new MongoDbContext(_database);
            // Gerçek SaleRepository oluşturuluyor.
            _repository = new SaleRepository(context);
            //SaleRepository -> MongoDbContext -> Test MongoDB Database
            await context.Sales.InsertManyAsync(CreateTestSales());
            //Test başlamadan önce MongoDB’ye sahte ama kontrollü satış verileri ekliyoruz.
        }

        //Testten sonra çalışacak teardown metodu. Geçici database'i siler.
        [TearDown]
        public async Task TearDown()
        {
            // Bu kontrol, SetUp sırasında bir hata olursa TearDown'ın patlamasını engeller.
            if (_mongoClient != null && !string.IsNullOrWhiteSpace(_databaseName))
            {
                // Sadece bu test için açılan database'i temizler.
                await _mongoClient.DropDatabaseAsync(_databaseName);
                // MongoClient kaynakları temizlenir.
                _mongoClient.Dispose();
            }
        }


        // Bu test endpoint'i test etmez. ->  GET /api/sales/chart/by-store-location
        // Burada test edilen şey -> SaleRepository.GetSalesByStoreLocationAsync()

        // MongoDB'deki satışları StoreLocation alanına göre gruplayabiliyor mu?
        // TotalSales doğru hesaplanıyor mu?
        // OrderCount doğru hesaplanıyor mu?
        [Test]
        public async Task GetSalesByStoreLocationAsync_WhenSalesExist_ShouldReturnGroupedTotals()
        {
            // ACT
            var result = await _repository.GetSalesByStoreLocationAsync();
            // Single kullanmamızın anlamı -> Tam olarak 1 tane Istanbul sonucu bekliyoruz.
            var istanbul = result.Single(x => x.StoreLocation == "Istanbul");
            // Dönen sonuç içinden Ankara grubunu buluyoruz.
            var ankara = result.Single(x => x.StoreLocation == "Ankara");

            // Test verilerinde sadece 2 farklı StoreLocation var:
            // Istanbul ve Ankara
            // Bu yüzden repository sonucunda da 2 grup bekliyoruz.
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

        // Test senaryosunda kullanılacak kontrollü satış verilerini oluşturur.
        // Bu mock değildir.

        // - Repository'nin davranışı taklit edilmiyor.
        // - MongoDB'nin davranışı taklit edilmiyor.
        // - Sadece MongoDB'ye yazılacak test verisi hazırlanıyor.
        // Bu veriler InsertManyAsync ile gerçek MongoDB'ye yazılır.



        //Gerçek MongoDB +gerçek repository + kontrollü test verisi = integration test
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
