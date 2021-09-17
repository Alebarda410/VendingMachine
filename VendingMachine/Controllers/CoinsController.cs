using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using VendingMachine.Models;

namespace VendingMachine.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoinsController : ControllerBase
    {
        public CoinsController(DataBaseContext context)
        {
            _db = context;
        }
        private readonly DataBaseContext _db;


        [HttpGet]
        public IEnumerable<Coin> GetAllCoins()
        {
            return _db.Coins;
        }
    }
}
