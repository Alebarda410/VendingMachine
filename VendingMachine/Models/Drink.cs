using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VendingMachine.Models
{
    [Table("Drinks")]
    public class Drink
    {
        [Key]
        public int Id { get; set; }

        [StringLength(50, MinimumLength = 2, ErrorMessage = "Недопустимая длина имени")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Изображение обязательно")]
        public string Logo { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Недопустимая цена")]
        public int Price { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Недопустимое количество")]
        public int Count { get; set; }

        public bool Availability { get; set; }
    }
}