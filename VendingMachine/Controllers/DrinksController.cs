using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using VendingMachine.Models;

namespace VendingMachine.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DrinksController : ControllerBase
    {
        public DrinksController(DataBaseContext context)
        {
            _db = context;
        }
        private readonly DataBaseContext _db;

        [HttpGet]
        public IEnumerable<Drink> GetAll()
        {
            return _db.Drinks;
        }
        [HttpDelete("/{id:int}")]
        public IActionResult Delete(int id)
        {
            var drink = _db.Drinks.FirstOrDefault(d => d.Id == id);
            if (drink == null)
            {
                return NotFound();
            }
            _db.Remove(drink);
            _db.SaveChanges();

            return Ok(drink);
        }

        [HttpPost]
        public IActionResult Create(Drink drink)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            _db.Drinks.Add(drink);
            _db.SaveChanges();
            return Ok(drink);
        }

        // протестировать как работает
        [HttpPut]
        public IActionResult Update(Drink drink)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            _db.Entry(drink).State = EntityState.Modified;
            _db.SaveChanges();

            return Ok(drink);
        }
    }
}
