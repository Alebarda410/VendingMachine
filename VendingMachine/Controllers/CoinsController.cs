using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
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
        // полчить все монеты
        public IEnumerable<Coin> GetAllCoins()
        {
            return _db.Coins;
        }

        [HttpPut]
        // изменение администратором
        public IActionResult UpdateCoin(Coin coin)
        {
            if (coin == null)
            {
                return BadRequest();
            }
            _db.Entry(coin).State = EntityState.Modified;
            _db.SaveChanges();
            return Ok();
        }

        [HttpPut("dec/{change:int}")]
        // выдем сдачу
        public IActionResult DecCoins(int change)
        {
            var dic = new Dictionary<int, int>();

            Change(dic, change);
            var coins = _db.Coins.Where(coin => dic.Keys.Contains(coin.Denomination));
            foreach (var coin in coins)
            {
                coin.Count -= dic[coin.Denomination];
            }
            _db.SaveChanges();
            return Ok(JsonConvert.SerializeObject(dic));
        }

        // генерация сдачи
        private void Change(Dictionary<int, int> coinBack, int money)
        {
            var curCoins = new Dictionary<int, int>();
            foreach (var coin in _db.Coins)
            {
                if (coin.Count <= 0) continue;
                curCoins[coin.Denomination] = coin.Count;
                coinBack[coin.Denomination] = 0;
            }

            var sortCurCoins = curCoins.OrderByDescending(pair => pair.Key);
            // key - номинал монеты
            foreach (var (key, _) in sortCurCoins)
            {
                if (money == 0)
                {
                    break;
                }
                var count = money / key;
                if (count <= 0) continue;

                curCoins[key] -= count;
                coinBack[key] += count;
                money -= count * key;
            }

            foreach (var key in coinBack.Keys.Where(key => coinBack[key] == 0))
            {
                coinBack.Remove(key);
            }
        }

        [HttpPut("inc")]
        // записываем внесенные монеты
        public IActionResult IncCoins(object json)
        {
            if (json == null)
            {
                return BadRequest();
            }
            var dic = JsonConvert.DeserializeObject<Dictionary<int, int>>(json.ToString()!);

            var editCoins = _db.Coins.Where(coin => dic.Keys.Contains(coin.Denomination));

            foreach (var coin in editCoins)
            {
                if (dic != null)
                {
                    coin.Count += dic[coin.Denomination];
                }
            }

            _db.SaveChanges();
            return Ok();
        }
    }
}
