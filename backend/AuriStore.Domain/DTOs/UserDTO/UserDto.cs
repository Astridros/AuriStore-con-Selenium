

using AuriStore.Domain.Enum;

namespace AuriStore.Domain.DTOs.UserDTO
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public DateTime CreateDate { get; set; }

    }
}
