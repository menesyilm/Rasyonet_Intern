using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using Rasyonet_Intern.API.Data.Sql;
using Rasyonet_Intern.API.Documents;

namespace Rasyonet_Intern.API.Services
{
    // Bu servis SQL verilerini MongoDB'ye senkronize etmekten sorumludur.
    // Quartz burada yok. Çünkü bu sınıf "ne zaman çalışacağım?" sorusuyla değil,
    // "çalışınca ne yapacağım?" sorusuyla ilgilenir.
    public class SqlToMongoSyncService
    {
        private readonly AppDbContext _sqlContext;
        // Entity -> Document dönüşümü için AutoMapper.
        private readonly IMapper _mapper;
        private readonly IMongoCollection<CategoryDocument> _categoryCollection;
        private readonly IMongoCollection<SaleDocument> _saleCollection;

        //Dependency Injection
        public SqlToMongoSyncService(AppDbContext sqlContext, IMongoDatabase mongoDatabase, IMapper mapper)
        {
            _sqlContext = sqlContext;
            _mapper = mapper;
            _categoryCollection = mongoDatabase.GetCollection<CategoryDocument>("Categories");
            _saleCollection = mongoDatabase.GetCollection<SaleDocument>("Sales");
        }

        // Dışarıdan çağrılacak ana senkronizasyon metodu.
        // Quartz job bu metodu çağırır.
        public async Task SyncAsync(CancellationToken cancellationToken = default)
        {
            // Job çalıştığında önce Category verileri SQL'den MongoDB'ye aktarılır.
            await SyncCategoriesAsync(cancellationToken);
            // Sonra Sale verileri SQL'den MongoDB'ye aktarılır.
            await SyncSalesAsync(cancellationToken);
        }

        // SQL'deki Categories tablosunu MongoDB'deki Categories collection'ına senkronize eder.
        private async Task SyncCategoriesAsync(CancellationToken cancellationToken)
        {
            //SQL'deki tüm Categories verilerini çeker.
            var categories = await _sqlContext.Categories
                //Sadece okuma amaçlı olduğu için AsNoTracking kullanılır. Bu, performansı artırır.
                .AsNoTracking()
                // Performans için Category ile ilişkili Performances verilerini de çeker.
                .Include(category => category.Performances)
                // Sonuçları listeye dönüştürür.
                .ToListAsync(cancellationToken);
            // SQL'den gelen her category için MongoDB tarafında upsert yapılır.
            foreach (var category in categories)
            {
                // SQL'den gelen her category nesnesini MongoDB dokümanına dönüştürür.
                // AutoMapper kullanarak Category nesnesini CategoryDocument nesnesine map eder.
                var document = _mapper.Map<CategoryDocument>(category);

                // MongoDB'de aynı SQL kaydının karşılığı var mı diye SqlId üzerinden aranır.
                var filter = Builders<CategoryDocument>.Filter.Eq(x => x.SqlId, category.Id);
                // MongoDB'de SqlId eşleşen kayıt varsa document tamamen değiştirilir.
                await _categoryCollection.ReplaceOneAsync(
                    filter,
                    document,
                    new ReplaceOptions { IsUpsert = true },
                    cancellationToken);
            }
        }
        // SQL'deki Sales tablosunu MongoDB'deki Sales collection'ına senkronize eder.
        private async Task SyncSalesAsync(CancellationToken cancellationToken)
        {
            var sales = await _sqlContext.Sales
                .AsNoTracking()
                .Include(sale => sale.SaleCustomer)
                .Include(sale => sale.SaleItems)
                .ToListAsync(cancellationToken);

            foreach (var sale in sales)
            {
                // SQL Sale entity'si MongoDB SaleDocument modeline dönüştürülür.
                var document = _mapper.Map<SaleDocument>(sale);
                // Eğer mapping sonucunda Customer null geldiyse boş bir Customer nesnesi oluşturulur.
                // Böylece MongoDB document içinde Customer alanı null kalmaz.
                document.Customer ??= new SaleCustomerDocument();

                // MongoDB'de aynı SQL satış kaydı SqlId üzerinden aranır.
                var filter = Builders<SaleDocument>.Filter.Eq(x => x.SqlId, sale.Id);
                // ReplaceOne + IsUpsert: varsa günceller, yoksa yeni Mongo dokümanı oluşturur.
                // Eşleşen kayıt varsa tamamen günceller.
                // Eşleşen kayıt yoksa yeni kayıt oluşturur.
                await _saleCollection.ReplaceOneAsync(
                    filter,
                    document,
                    new ReplaceOptions { IsUpsert = true },
                    cancellationToken);
            }
        }
    }
}
