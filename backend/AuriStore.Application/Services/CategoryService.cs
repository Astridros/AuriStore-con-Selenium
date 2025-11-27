using AuriStore.Application.Interfaces;
using AuriStore.Domain.DTOs.CategoryDTO;
using AuriStore.Domain.Entities;
using AuriStore.Domain.Interfaces;

namespace AuriStore.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
        {
            try
            {
                // Validar duplicado
                if (await _categoryRepository.ExistsByNameAsync(dto.Name))
                    throw new Exception("Ya existe una categoría con este nombre.");

                var category = new Category
                {
                    Name = dto.Name,
                    Description = dto.Description
                };

                await _categoryRepository.AddAsync(category);
                await _categoryRepository.SaveChangesAsync();

                return MapToDto(category);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear la categoría.", ex);
            }
        }

        public async Task<IEnumerable<CategoryDto>> GetAllAsync()
        {
            try
            {
                var categories = await _categoryRepository.GetAllAsync();
                return categories.Select(MapToDto);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener las categorías.", ex);
            }
        }

        public async Task<CategoryDto?> GetByIdAsync(int id)
        {
            try
            {
                var category = await _categoryRepository.GetByIdAsync(id);
                return category == null ? null : MapToDto(category);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener la categoría por ID.", ex);
            }
        }

        public async Task<CategoryDto?> UpdateAsync(int id, UpdateCategoryDto dto)
        {
            try
            {
                var category = await _categoryRepository.GetByIdAsync(id);

                if (category == null)
                    return null;

                // Validar nombres duplicados si cambió
                if (category.Name != dto.Name &&
                    await _categoryRepository.ExistsByNameAsync(dto.Name))
                {
                    throw new Exception("Ya existe una categoría con este nombre.");
                }

                category.Name = dto.Name;
                category.Description = dto.Description;

                await _categoryRepository.UpdateAsync(category);
                await _categoryRepository.SaveChangesAsync();

                return MapToDto(category);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al actualizar la categoría.", ex);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var category = await _categoryRepository.GetByIdAsync(id);

                if (category == null)
                    return false;

                await _categoryRepository.DeleteAsync(category);
                await _categoryRepository.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al eliminar la categoría.", ex);
            }
        }

        private static CategoryDto MapToDto(Category category)
        {
            return new CategoryDto
            {
                CategoryId = category.CategoryId,
                Name = category.Name,
                Description = category.Description
            };
        }
    }
}
