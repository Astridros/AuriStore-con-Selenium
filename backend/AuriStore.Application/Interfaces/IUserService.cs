

using AuriStore.Domain.DTOs.UserDTO;
using AuriStore.Domain.Entities;

namespace AuriStore.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserDto> RegisterAsync(CreateUserDto dto);
        Task<IEnumerable<UserDto>> GetUsersAsync();
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto dto);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto);
    }
}
