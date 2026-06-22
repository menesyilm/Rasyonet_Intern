using MongoDB.Bson;
using MongoDB.Driver;
using Rasyonet_Intern.API.Data;
using Rasyonet_Intern.API.DTOs;
using Rasyonet_Intern.API.Models;
using Rasyonet_Intern.API.Repositories.Interfaces;

namespace Rasyonet_Intern.API.Repositories.Implementations
{
    public class SaleRepository : ISaleRepository
    {
        private readonly IMongoCollection<Sale> _salesCollection;
        public SaleRepository(MongoDbContext context)
        {
            _salesCollection = context.Sales;
        }
        // Implement other methods as needed
        public async Task<List<Sale>> GetAllAsync()
        {
            return await _salesCollection.Find(_ => true).ToListAsync();
        }

        public async Task<Sale> GetByIdAsync(string id)
        {
            return await _salesCollection.Find(s => s.Id == id).FirstOrDefaultAsync();
        }

        // BAR CHART: Mağaza lokasyonuna göre toplam satış
        public async Task<List<StoreLocationSalesDto>> GetSalesByStoreLocationAsync()
        {
            var pipeline = new[]
            {
                //items bir array. ve $unwind, array’i parçalar.
                new BsonDocument("$unwind", "$items"),
                //$group mağaza lokasyonuna göre grupluyor.
                new BsonDocument("$group", new BsonDocument
                {
                    //Gruplama anahtarı -> MongoDB’de $group içinde gruplama alanı _id ile belirtilir.
                    { "_id", "$storeLocation" },
                    //Her item için price * quantity hesapla, sonra bunları lokasyon bazında topla.
                    //örneğin :
                    //London: 100 * 2 = 200
                    //50 * 1 = 50
                    //20 * 5 = 100
                    //totalSales = 350
                    //Yani bu satır: SUM(items.price * items.quantity) anlamına gelir.
                    { "totalSales", new BsonDocument("$sum",
                        new BsonDocument("$multiply", new BsonArray { "$items.price", "$items.quantity" })) },
                    //Sipariş sayısı hesaplama
                    { "orderCount", new BsonDocument("$addToSet", "$_id") }
                }),
                //$project, sonucu şekillendirme aşamasıdır.
                new BsonDocument("$project", new BsonDocument
                {
                    //_id alanını storeLocation yapma
                    { "storeLocation", "$_id" },
                    // totalSales alanını olduğu gibi bırak
                    { "totalSales", 1 },
                    // Sipariş setinin boyutunu alma
                    { "orderCount", new BsonDocument("$size", "$orderCount") }
                }),
                //Azalan sırada sıralama yapar. -1 azalan, 1 artan
                new BsonDocument("$sort", new BsonDocument("totalSales", -1))
            };
            //pipeline'ı MongoDB üzerinde çalıştırma
            //Veriyi aggregation pipeline ile işler. Ayrıca aggregation = birleştirme 
            var result = await _salesCollection.Aggregate<BsonDocument>(pipeline).ToListAsync();
            //Mongo sonucunu DTO’ya çevirme
            return result.Select(doc => new StoreLocationSalesDto
            {
                StoreLocation = doc["storeLocation"].AsString,
                TotalSales = doc["totalSales"].ToDecimal(),
                OrderCount = doc["orderCount"].ToInt32()
            }).ToList();
        }
        // PIE CHART: Ödeme yöntemine göre dağılım
        public async Task<List<PurchaseMethodDistributionDto>> GetSalesByPurchaseMethodAsync()
        {
            var pipeline = new[]
            {
                new BsonDocument("$unwind", "$items"),
                new BsonDocument("$group", new BsonDocument
                {
                    { "_id", "$purchaseMethod" },
                    { "totalSales", new BsonDocument("$sum",
                        new BsonDocument("$multiply", new BsonArray { "$items.price", "$items.quantity" })) },
                    { "orderCount", new BsonDocument("$addToSet", "$_id") }
                }),
                new BsonDocument("$project", new BsonDocument
                {
                    { "purchaseMethod", "$_id" },
                    { "totalSales", 1 },
                    { "orderCount", new BsonDocument("$size", "$orderCount") }
                }),
                //Azalan sırada sıralama yapar. -1 azalan, 1 artan
                new BsonDocument("$sort", new BsonDocument("totalSales", -1))
            };

            var result = await _salesCollection.Aggregate<BsonDocument>(pipeline).ToListAsync();

            return result.Select(doc => new PurchaseMethodDistributionDto
            {
                PurchaseMethod = doc["purchaseMethod"].AsString,
                TotalSales = doc["totalSales"].ToDecimal(),
                OrderCount = doc["orderCount"].ToInt32()
            }).ToList();
        }
        // LINE CHART: Aylara göre satış trendi
        public async Task<List<MonthlySalesTrendDto>> GetMonthlySalesTrendAsync()
        {
            var pipeline = new[]
            {
                new BsonDocument("$unwind", "$items"),
                new BsonDocument("$group", new BsonDocument
                {
                    { "_id", new BsonDocument
                        {
                            { "year", new BsonDocument("$year", "$saleDate") },
                            { "month", new BsonDocument("$month", "$saleDate") }
                        }
                    },
                    { "totalSales", new BsonDocument("$sum",
                        new BsonDocument("$multiply", new BsonArray { "$items.price", "$items.quantity" })) },
                    { "orderCount", new BsonDocument("$addToSet", "$_id") }
                }),
                new BsonDocument("$project", new BsonDocument
                {
                    { "year", "$_id.year" },
                    { "month", "$_id.month" },
                    { "totalSales", 1 },
                    { "orderCount", new BsonDocument("$size", "$orderCount") }
                }),
                //yılı ve ayı artan sırada sıralama yapar. -1 azalan, 1 artan
                new BsonDocument("$sort", new BsonDocument { { "year", 1 }, { "month", 1 } })
            };

            var result = await _salesCollection.Aggregate<BsonDocument>(pipeline).ToListAsync();

            return result.Select(doc =>
            {
                int year = doc["year"].ToInt32();
                int month = doc["month"].ToInt32();
                return new MonthlySalesTrendDto
                {
                    Year = year,
                    Month = month,
                    Period = $"{year}-{month:D2}",
                    TotalSales = doc["totalSales"].ToDecimal(),
                    OrderCount = doc["orderCount"].ToInt32()
                };
            }).ToList();
        }
    }
}
