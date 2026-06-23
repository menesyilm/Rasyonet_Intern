using MongoDB.Driver;
using Rasyonet_Intern.API.Data.Sql;
using Rasyonet_Intern.API.Documents;
using Rasyonet_Intern.API.Entities;

namespace Rasyonet_Intern.API.Services
{
    //Tek seferlik veri taşıma işlemi için kullandığım servis.
    //MongoDB'den SQL Server'a veri taşımak için kullandım.
    public class DataMigrationService
    {
        private readonly IMongoDatabase _mongoDatabase;
        private readonly AppDbContext _sqlContext;
        public DataMigrationService(IMongoDatabase mongoDatabase, AppDbContext sqlContext)
        {
            _mongoDatabase = mongoDatabase;
            _sqlContext = sqlContext;
        }
        public async Task MigrateMongoToSqlAsync()
        {
            await MigrateCategoriesAsync();
            await MigrateSalesAsync();
        }
        private async Task MigrateCategoriesAsync()
        {
            var categoryCollection = _mongoDatabase.GetCollection<CategoryDocument>("Categories");
            var mongoCategories = await categoryCollection.Find(_ => true).ToListAsync();

            foreach (var mongoCategory in mongoCategories)
            {
                var sqlCategory = new Category
                {
                    CategoryName = mongoCategory.CategoryName,
                    Performances = mongoCategory.Performances.Select(p => new Performance
                    {
                        UniqueCode = p.UniqueCode,
                        PerformanceName = p.PerformanceName,
                        Value = p.Value,
                        Price = p.Price,
                        DailyChange = p.DailyChange,
                        WeeklyChange = p.WeeklyChange,
                        MonthlyChange = p.MonthlyChange                        
                    }).ToList(),
                };

                await _sqlContext.Categories.AddAsync(sqlCategory);
            }
            await _sqlContext.SaveChangesAsync();
        }

        private async Task MigrateSalesAsync()
        {
            var saleCollection = _mongoDatabase.GetCollection<SaleDocument>("Sales");
            var mongoSales = await saleCollection.Find(_ => true).ToListAsync();

            foreach(var mongoSale in mongoSales)
            {
                var sqlSale = new Sale
                {
                    SaleDate = mongoSale.SaleDate,
                    CouponUsed = mongoSale.CouponUsed,
                    StoreLocation = mongoSale.StoreLocation,
                    PurchaseMethod = mongoSale.PurchaseMethod,

                    SaleCustomer = new SaleCustomer
                    {
                        Gender = mongoSale.Customer.Gender,
                        Age = mongoSale.Customer.Age,
                        Email = mongoSale.Customer.Email,
                        Satisfaction = mongoSale.Customer.Satisfaction
                    },

                    SaleItems = mongoSale.Items.Select(i => new SaleItem
                    {
                        Name = i.Name,
                        Price = i.Price,
                        Quantity = i.Quantity,
                    }).ToList()
                };
                await _sqlContext.Sales.AddAsync(sqlSale);
            }
            await _sqlContext.SaveChangesAsync();
        }


    }
}