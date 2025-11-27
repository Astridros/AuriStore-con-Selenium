

using AuriStore.Domain.Entities;

namespace AuriStore.Domain.Interfaces
{
    public interface ICategoryRepository : IGeneryRepository<Category>
    {
        Task<bool> ExistsByNameAsync(string name);
    }
}
