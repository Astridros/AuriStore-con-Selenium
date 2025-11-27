

using AuriStore.Domain.Entities;
using AuriStore.Domain.Interfaces;
using AuriStore.Infrastructure.GeneryRepository;
using AuriStore.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace AuriStore.Infrastructure.Repositories
{
    public class UserRepository : GeneryRepository<Users>, IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<Users?> GetByEmailAsync(string email)
        {
            return await _context.Users
               .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }
    }
}
