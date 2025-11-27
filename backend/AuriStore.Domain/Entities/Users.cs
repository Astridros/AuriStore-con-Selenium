
using AuriStore.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace AuriStore.Domain.Entities
{
    public class Users
    {
        [Key]
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public UserRol UserRole { get; set; }
        public DateTime CreateDate { get; set; } = DateTime.Now;

     }

}
