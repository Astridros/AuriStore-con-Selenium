
using AuriStore.Application.Interfaces;
using AuriStore.Domain.DTOs.UserDTO;
using AuriStore.Domain.Interfaces;

namespace AuriStore.Application.Services
{
    public class LoginService : ILoginService
    {
        private readonly IUserRepository _userRepository;


        public LoginService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }


        public async Task<UserDto?> LoginAsync(LoginDto dto)
        {
            try
            {
                // 1. Buscar usuario por email
                var user = await _userRepository.GetByEmailAsync(dto.Email);

                if (user == null)
                    return null;

                // 2. Validar contraseña
                bool isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

                if (!isValid)
                    return null;

                // 3. Mapear a DTO de salida
                return new UserDto
                {
                    UserId = user.UserId,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = user.UserRole.ToString(),
                    CreateDate = user.CreateDate
                };
            }
            catch (Exception ex)
            {
                // Registrar en logs si quieres aquí
                throw new Exception("Ha ocurrido un error al iniciar sesion.", ex);
            }
        }


    }
}
