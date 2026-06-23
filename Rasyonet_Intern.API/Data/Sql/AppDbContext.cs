using Microsoft.EntityFrameworkCore;
using Rasyonet_Intern.API.Entities;

namespace Rasyonet_Intern.API.Data.Sql
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Performance> Performances { get; set; }
        public DbSet<Sale> Sales { get; set; }
        public DbSet<SaleCustomer> SaleCustomers { get; set; }
        public DbSet<SaleItem> SaleItems { get; set; }

        public DbSet<SyncState> SyncStates { get; set; }
    }
}