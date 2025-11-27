

using AuriStore.Application.Interfaces;
using AuriStore.Domain.DTOs.UserDTO;
using AuriStore.Domain.Entities;
using AuriStore.Domain.Enum;
using AuriStore.Domain.Interfaces;

namespace AuriStore.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserDto> RegisterAsync(CreateUserDto dto)
        {
            try
            {
                // Validar email existente
                if (await _userRepository.ExistsByEmailAsync(dto.Email))
                    throw new Exception("El correo ya está registrado.");

                // Crear el usuario
                var user = new Users
                {
                    UserName = dto.UserName,
                    Email = dto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    UserRole = UserRol.User,
                    CreateDate = DateTime.Now
                };

                await _userRepository.AddAsync(user);
                await _userRepository.SaveChangesAsync();

                return MapToDto(user);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al registrar el usuario. Detalles: " + ex.Message, ex);
            }
        }

        public async Task<IEnumerable<UserDto>> GetUsersAsync()
        {
            try
            {
                var users = await _userRepository.GetAllAsync();
                return users.Select(MapToDto);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los usuarios.", ex);
            }
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(id);
                return user == null ? null : MapToDto(user);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el usuario por ID.", ex);
            }
        }

        public async Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto dto)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(id);

                if (user == null)
                    return null;

                if (user.Email != dto.Email && await _userRepository.ExistsByEmailAsync(dto.Email))
                    throw new Exception("El correo ya está registrado.");

                user.UserName = dto.UserName;
                user.Email = dto.Email;
                user.UserRole = Enum.Parse<UserRol>(dto.Role, true);

                await _userRepository.UpdateAsync(user);
                await _userRepository.SaveChangesAsync();

                return MapToDto(user);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al actualizar el usuario.", ex);
            }
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(id);

                if (user == null)
                    return false;

                await _userRepository.DeleteAsync(user);
                await _userRepository.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al eliminar el usuario.", ex);
            }
        }

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);

                if (user == null)
                    return false;

                bool isValid = BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash);

                if (!isValid)
                    return false;

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

                await _userRepository.UpdateAsync(user);
                await _userRepository.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al cambiar la contraseña del usuario.", ex);
            }
        }

        private static UserDto MapToDto(Users user)
        {
            return new UserDto
            {
                UserId = user.UserId,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.UserRole.ToString(),
                CreateDate = user.CreateDate
            };
        }
    }
}
