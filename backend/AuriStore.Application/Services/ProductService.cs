

using AuriStore.Application.Interfaces;
using AuriStore.Domain.DTOs.ProductDTO;
using AuriStore.Domain.Entities;
using AuriStore.Domain.Interfaces;

namespace AuriStore.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepo;
        private readonly ICategoryRepository _categoryRepo;

        public ProductService(IProductRepository productRepo, ICategoryRepository categoryRepo)
        {
            _productRepo = productRepo;
            _categoryRepo = categoryRepo;
        }

        public async Task<ProductDto> CreateAsync(CreateProductDto dto)
        {
            if (await _categoryRepo.GetByIdAsync(dto.CategoryId) == null)
                throw new Exception("La categoría no existe.");

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                CategoryId = dto.CategoryId,
                ImageUrl = dto.ImageUrl
            };

            await _productRepo.AddAsync(product);
            await _productRepo.SaveChangesAsync();

            return ToDto(product);
        }

        public async Task<ProductDto?> UpdateAsync(int id, UpdateProductDto dto)
        {
            var product = await _productRepo.GetByIdAsync(id);
            if (product == null) return null;

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Stock = dto.Stock;
            product.CategoryId = dto.CategoryId;
            product.ImageUrl = dto.ImageUrl;

            await _productRepo.UpdateAsync(product);
            await _productRepo.SaveChangesAsync();

            return ToDto(product);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _productRepo.GetByIdAsync(id);
            if (product == null) return false;

            await _productRepo.DeleteAsync(product);
            await _productRepo.SaveChangesAsync();

            return true;
        }

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var product = await _productRepo.GetByIdAsync(id);
            return product == null ? null : ToDto(product);
        }

        public async Task<IEnumerable<ProductDto>> GetAllAsync()
        {
            var list = await _productRepo.GetAllAsync();
            return list.Select(ToDto);
        }

        public async Task<IEnumerable<ProductDto>> GetByCategoryAsync(int categoryId)
        {
            var list = await _productRepo.GetByCategoryAsync(categoryId);
            return list.Select(ToDto);
        }

        private static ProductDto ToDto(Product p)
        {
            return new ProductDto
            {
                ProductId = p.ProductId,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                ImageUrl = p.ImageUrl,
                CategoryId = p.CategoryId
            };
        }
    }
}
