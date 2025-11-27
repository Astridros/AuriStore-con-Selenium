

using AuriStore.Domain.Entities;
using AuriStore.Domain.Interfaces;
using AuriStore.Infrastructure.GeneryRepository;
using AuriStore.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace AuriStore.Infrastructure.Repositories
{
    public class ProductRepository : GeneryRepository<Product>, IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId)
        {
            return await _context.Products
                .Where(p => p.CategoryId == categoryId)
                .ToListAsync();
        }
    }
}
