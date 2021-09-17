using Microsoft.EntityFrameworkCore;

namespace VendingMachine.Models
{
    public sealed class DataBaseContext : DbContext
    {
        public DbSet<Drink> Drinks { get; set; }
        public DbSet<Coin> Coins { get; set; }

        public DataBaseContext(DbContextOptions<DataBaseContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }
    }
}