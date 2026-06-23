using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using Rasyonet_Intern.API.Data.Sql;
using Rasyonet_Intern.API.Documents;

namespace Rasyonet_Intern.API.Services
{
    public class SqlToMongoSyncService
    {
        private readonly AppDbContext _sqlContext;
        private readonly IMongoCollection<CategoryDocument> _categoryCollection;
        private readonly IMongoCollection<SaleDocument> _saleCollection;

        public SqlToMongoSyncService(AppDbContext sqlContext, IMongoDatabase mongoDatabase)
        {
            _sqlContext = sqlContext;
            _categoryCollection = mongoDatabase.GetCollection<CategoryDocument>("Categories");
            _saleCollection = mongoDatabase.GetCollection<SaleDocument>("Sales");
        }

        public async Task SyncAsync(CancellationToken cancellationToken = default)
        {
            await SyncCategoriesAsync(cancellationToken);
            await SyncSalesAsync(cancellationToken);
        }

        private async Task SyncCategoriesAsync(CancellationToken cancellationToken)
        {
            var categories = await _sqlContext.Categories
                .AsNoTracking()
                .Include(category => category.Performances)
                .ToListAsync(cancellationToken);

            foreach (var category in categories)
            {
                var document = new CategoryDocument
                {
                    SqlId = category.Id,
                    CategoryName = category.CategoryName,
                    Performances = category.Performances.Select(performance => new PerformanceDocument
                    {
                        UniqueCode = performance.UniqueCode,
                        PerformanceName = performance.PerformanceName,
                        Value = performance.Value,
                        Price = performance.Price,
                        DailyChange = performance.DailyChange,
                        WeeklyChange = performance.WeeklyChange,
                        MonthlyChange = performance.MonthlyChange
                    }).ToList()
                };

                var filter = Builders<CategoryDocument>.Filter.Eq(x => x.SqlId, category.Id);
                await _categoryCollection.ReplaceOneAsync(
                    filter,
                    document,
                    new ReplaceOptions { IsUpsert = true },
                    cancellationToken);
            }
        }

        private async Task SyncSalesAsync(CancellationToken cancellationToken)
        {
            var sales = await _sqlContext.Sales
                .AsNoTracking()
                .Include(sale => sale.SaleCustomer)
                .Include(sale => sale.SaleItems)
                .ToListAsync(cancellationToken);

            foreach (var sale in sales)
            {
                var document = new SaleDocument
                {
                    SqlId = sale.Id,
                    SaleDate = sale.SaleDate,
                    CouponUsed = sale.CouponUsed,
                    StoreLocation = sale.StoreLocation,
                    PurchaseMethod = sale.PurchaseMethod,
                    Customer = new SaleCustomerDocument
                    {
                        Gender = sale.SaleCustomer?.Gender ?? string.Empty,
                        Age = sale.SaleCustomer?.Age ?? 0,
                        Email = sale.SaleCustomer?.Email ?? string.Empty,
                        Satisfaction = sale.SaleCustomer?.Satisfaction ?? 0
                    },
                    Items = sale.SaleItems.Select(item => new SaleItemDocument
                    {
                        Name = item.Name,
                        Price = item.Price,
                        Quantity = item.Quantity,
                        Tags = string.IsNullOrWhiteSpace(item.Tags)
                            ? new List<string>()
                            : item.Tags.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries).ToList()
                    }).ToList()
                };

                var filter = Builders<SaleDocument>.Filter.Eq(x => x.SqlId, sale.Id);
                await _saleCollection.ReplaceOneAsync(
                    filter,
                    document,
                    new ReplaceOptions { IsUpsert = true },
                    cancellationToken);
            }
        }
    }
}
