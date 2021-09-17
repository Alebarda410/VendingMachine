using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using VendingMachine.MyValidationAttributes;

namespace VendingMachine.Models
{
    [Table("Drinks")]
    public class Drink
    {
        [Key]
        public int Id { get; set; }

        [StringLength(50, MinimumLength = 2, ErrorMessage = "Недопустимая длина имени")]
        [Required(ErrorMessage = "Данное поле обязательно")]
        public string Name { get; set; }

        [ImageValid]
        public string Logo { get; set; }

        [Required(ErrorMessage = "Данное поле обязательно")]
        [Range(1, int.MaxValue, ErrorMessage = "Недопустимая цена")]
        public int Price { get; set; }

        [Required(ErrorMessage = "Данное поле обязательно")]
        [Range(1, int.MaxValue, ErrorMessage = "Недопустимое количество")]
        public int Count { get; set; }

        [Required(ErrorMessage = "Данное поле обязательно")]
        public bool Availability { get; set; }
    }
}