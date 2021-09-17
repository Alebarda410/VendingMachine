using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VendingMachine.Models
{
    [Table("Coins")]
    public class Coin
    {
        [Key]
        public int Id { get; set; }
        public int Denomination { get; set; }
        public int Count { get; set; }
        public bool Availability { get; set; }
    }
}