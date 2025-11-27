using AuriStore.Application.Interfaces;
using AuriStore.Domain.DTOs.UserDTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AuriStore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ILoginService _loginService;

        public AuthController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _loginService.LoginAsync(dto);

            if (result == null)
                return Unauthorized(new { message = "Email o contraseña incorrectos." });

            return Ok(result);
        }
    }
}
