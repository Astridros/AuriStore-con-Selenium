using AuriStore.Domain.DTOs.UserDTO;
using AuriStore.Domain.Entities;

namespace AuriStore.Domain.Interfaces
{
    public interface IUserRepository: IGeneryRepository<Users>
    {
        Task<Users?> GetByEmailAsync(string email);
        Task<bool> ExistsByEmailAsync(string email);
    }
}
