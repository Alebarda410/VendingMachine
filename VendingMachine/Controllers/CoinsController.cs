using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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
        // полчить все монеты
        public IEnumerable<Coin> GetAllCoins()
        {
            return _db.Coins;
        }

        [HttpPut]
        // изменение администратором
        public IActionResult PutCoin(Coin coin)
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
        public IActionResult DecCoins([FromRoute] int change)
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
        private void Change(IDictionary<int, int> dic, int money)
        {
            var curCoins = new Dictionary<int, int>();
            foreach (var coin in _db.Coins)
            {
                if (coin.Count <= 0) continue;
                curCoins[coin.Denomination] = coin.Count;
                dic[coin.Denomination] = 0;
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
                dic[key] += count;
                money -= count * key;
            }

            foreach (var key in dic.Keys)
            {
                if (dic[key] == 0)
                {
                    dic.Remove(key);
                }
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
                coin.Count += dic[coin.Denomination];
            }

            _db.SaveChanges();
            return Ok();
        }
    }
}
