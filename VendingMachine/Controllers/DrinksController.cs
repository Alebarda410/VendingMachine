using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System.Collections.Generic;
using System.Linq;
using VendingMachine.Models;

namespace VendingMachine.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DrinksController : ControllerBase
    {
        public DrinksController(DataBaseContext context, IWebHostEnvironment appEnvironment)
        {
            _db = context;
            _appEnvironment = appEnvironment;

        }
        private readonly IWebHostEnvironment _appEnvironment;
        private readonly DataBaseContext _db;

        [HttpGet]
        // список напитков которые можно купить
        public IEnumerable<Drink> Get()
        {
            return _db.Drinks.Where(drink => drink.Count > 0 && drink.Availability);
        }

        [HttpGet("{id:int}")]
        // список всех напитков
        public IEnumerable<Drink> AllGet(int id)
        {
            return id == 3 ? _db.Drinks : null;
        }

        [HttpDelete("{id:int}")]
        // удалить напиток
        public IActionResult DeleteDrink(int id)
        {
            var drink = _db.Drinks.Find(id);
            if (drink == null)
            {
                return BadRequest();
            }
            // доп проверка из-за того что может быть удаление пользователя
            // без обновления изображения
            if (drink.Logo.Contains('.'))
            {
                System.IO.File.Delete(_appEnvironment.WebRootPath + drink.Logo);

            }
            _db.Drinks.Remove(drink);
            _db.SaveChanges();
            return Ok();
        }

        [HttpPut("{id:int}")]
        // отдельная загрузка файла
        public ActionResult<string> EditLogo(int id, IFormFile file)
        {
            if (file == null)
            {
                return BadRequest("Файл не был загружен");
            }
            if (file.Length > 5242880)
            {
                return BadRequest("Файл должен быть меньше 5 мегабайт");
            }
            if (!file.ContentType.Contains("image/"))
            {
                return BadRequest("Неверный тип файла");
            }

            var drink = _db.Drinks.Find(id);
            if (drink == null)
            {
                return BadRequest();
            }
            System.IO.File.Delete(_appEnvironment.WebRootPath + drink.Logo);
            var img = Image.Load(file.OpenReadStream());
            img.Mutate(x => x.Resize(300, 400));
            drink.Logo = $"/upload/{drink.Id}_logo.{file.FileName.Split('.').Last()}";
            img.Save(_appEnvironment.WebRootPath + drink.Logo);

            _db.SaveChanges();
            return Ok(drink.Logo);
        }

        [HttpPut]
        // обновить состояние напитка
        public ActionResult<Drink> EditDrink(Drink drink)
        {
            _db.Entry(drink).State = EntityState.Modified;
            _db.SaveChanges();
            return Ok(drink);
        }

        [HttpPost]
        // добавить напиток
        public ActionResult<Drink> AddDrink(Drink drink)
        {
            _db.Drinks.Add(drink);
            _db.SaveChanges();
            return Ok(drink);
        }
    }
}
