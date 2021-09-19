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

        [Range(1, int.MaxValue, ErrorMessage = "Недопустимое количество")]
        public int Count { get; set; }

        public bool Availability { get; set; }
    }
}