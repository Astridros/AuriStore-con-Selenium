
using AuriStore.Domain.DTOs.UserDTO;

namespace AuriStore.Application.Interfaces
{
    public interface ILoginService
    {
        Task<UserDto?> LoginAsync(LoginDto login);
    }
}
