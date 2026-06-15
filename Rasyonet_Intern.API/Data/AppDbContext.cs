using Microsoft.EntityFrameworkCore;
using Rasyonet_Intern.API.Models;

namespace Rasyonet_Intern.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<FonKategori> fonKategoriler { get; set; }
        public DbSet<FonPerformans> fonPerformanslar { get; set; }
    }
}
