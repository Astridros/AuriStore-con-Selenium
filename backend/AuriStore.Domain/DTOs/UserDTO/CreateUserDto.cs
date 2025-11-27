

using AuriStore.Domain.Enum;

namespace AuriStore.Domain.DTOs.UserDTO
{
    public class CreateUserDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
