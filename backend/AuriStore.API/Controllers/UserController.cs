using AuriStore.Application.Interfaces;
using AuriStore.Domain.DTOs.UserDTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AuriStore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] CreateUserDto dto)
        {
            try
            {
                var result = await _userService.RegisterAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = result.UserId }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}/ById")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
                return NotFound(new { message = "Usuario no encontrado." });

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
        {
            try
            {
                var result = await _userService.UpdateUserAsync(id, dto);

                if (result == null)
                    return NotFound(new { message = "Usuario no encontrado." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _userService.DeleteUserAsync(id);

            if (!deleted)
                return NotFound(new { message = "Usuario no encontrado." });

            return NoContent();
        }

        [HttpPatch("{id}/change-password")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordDto dto)
        {
            var result = await _userService.ChangePasswordAsync(id, dto);

            if (!result)
                return BadRequest(new { message = "Contraseña actual incorrecta o usuario no encontrado." });

            return Ok(new { message = "Contraseña actualizada correctamente." });
        }
    }
}

