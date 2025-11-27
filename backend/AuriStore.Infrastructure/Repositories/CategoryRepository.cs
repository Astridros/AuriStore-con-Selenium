

using AuriStore.Domain.Entities;
using AuriStore.Domain.Interfaces;
using AuriStore.Infrastructure.GeneryRepository;
using AuriStore.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace AuriStore.Infrastructure.Repositories
{
    public class CategoryRepository : GeneryRepository<Category>, ICategoryRepository
    {
        private readonly AppDbContext _context;

        public CategoryRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<bool> ExistsByNameAsync(string name)
        {
            return await _context.Categories
                .AnyAsync(c => c.Name.ToLower() == name.ToLower());
        }
    }
}
