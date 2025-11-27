using AuriStore.Domain.Entities;

namespace AuriStore.Domain.Interfaces
{
    public interface IProductRepository : IGeneryRepository<Product>
    {
        Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId);
    }
}
