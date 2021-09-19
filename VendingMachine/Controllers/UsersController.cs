using Microsoft.AspNetCore.Mvc;

namespace VendingMachine.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        [HttpGet("{id:int}")]
        public IActionResult AdminRedirect([FromRoute] int id)
        {
            if (id == 3)
            {
                return Ok();
            }

            return BadRequest();
        }
    }
}
