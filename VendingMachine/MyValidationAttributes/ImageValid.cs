using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace VendingMachine.MyValidationAttributes
{
    public class ImageValid : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value is not IFormFile logo)
            {
                this.ErrorMessage = "Выберите файл";
                return false;
            }

            if (logo.Length > 5242880)
            {
                this.ErrorMessage = "Файл должен быть меньше 5 мегабайт!";
                return false;
            }

            if (!logo.ContentType.Contains("image/"))
            {
                this.ErrorMessage = "Неверный тип файла!";
                return false;
            }

            return true;
        }
    }
}