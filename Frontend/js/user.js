// Configuración de la API
const API_BASE_URL = 'https://localhost:7157/api';

// Variables globales
let allProducts = [];
let allCategories = [];
let currentCategoryFilter = null;

// Verificar autenticación al cargar
window.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    await loadUserData();
    await loadCategories();
    await loadProducts();
});

// Verificar si el usuario está autenticado
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }
    
    // TODO: Descomentar cuando admin.html esté listo
    // const userData = JSON.parse(user);
    // if (userData.role === 'Admin') {
    //     window.location.href = 'admin.html';
    // }
}

// Cargar datos del usuario
async function loadUserData() {
    const userName = localStorage.getItem('userName');
    document.getElementById('userName').textContent = userName || 'Usuario';
}

// Cerrar sesión
function logout() {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro que deseas salir?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            window.location.href = 'auth.html';
        }
    });
}

// Cargar categorías
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/Category`);
        if (response.ok) {
            allCategories = await response.json();
            renderCategories();
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

// Renderizar categorías
function renderCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    
    allCategories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = category.name;
        button.onclick = function() {
            filterByCategory(category.categoryId, this);
        };
        categoryFilter.appendChild(button);
    });
}

// Cargar productos
async function loadProducts() {
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/Product`);
        if (response.ok) {
            allProducts = await response.json();
            renderProducts(allProducts);
        } else {
            showError('Error al cargar los productos');
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showError('Error de conexión con el servidor');
    } finally {
        showLoading(false);
    }
}

// Renderizar productos
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    const emptyState = document.getElementById('emptyState');
    
    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    products.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

// Crear tarjeta de producto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => showProductDetail(product);
    
    // Buscar el nombre de la categoría por categoryId
    const categoryName = getCategoryName(product.categoryId);
    
    // Determinar estado del stock
    let stockBadge = '';
    if (product.stock === 0) {
        stockBadge = '<span class="stock-badge out-stock"><i class="bi bi-x-circle"></i> Agotado</span>';
    } else if (product.stock < 10) {
        stockBadge = `<span class="stock-badge low-stock"><i class="bi bi-exclamation-circle"></i> Quedan ${product.stock}</span>`;
    } else {
        stockBadge = `<span class="stock-badge in-stock"><i class="bi bi-check-circle"></i> Disponible (${product.stock})</span>`;
    }
    
    card.innerHTML = `
        <div class="product-image">
            ${product.imageUrl ? 
                `<img src="${product.imageUrl}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;">` : 
                '<i class="bi bi-headphones"></i>'
            }
        </div>
        <div class="product-info">
            <span class="product-category">${categoryName}</span>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description || 'Sin descripción'}</p>
            <div class="product-footer">
                <div>
                    <div class="product-price">${product.price.toFixed(2)}</div>
                    ${stockBadge}
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Obtener nombre de categoría por ID
function getCategoryName(categoryId) {
    if (!categoryId) return 'Sin categoría';
    
    const category = allCategories.find(c => c.categoryId === categoryId);
    return category ? category.name : 'Sin categoría';
}

// Mostrar detalle del producto
function showProductDetail(product) {
    let stockInfo = '';
    if (product.stock === 0) {
        stockInfo = '<span class="badge bg-danger">Agotado</span>';
    } else if (product.stock < 10) {
        stockInfo = `<span class="badge bg-warning">Quedan solo ${product.stock} unidades</span>`;
    } else {
        stockInfo = `<span class="badge bg-success">En stock (${product.stock} disponibles)</span>`;
    }
    
    Swal.fire({
        title: product.name,
        html: `
            <div style="text-align: left;">
                ${product.imageUrl ? 
                    `<img src="${product.imageUrl}" style="width:100%; max-height:300px; object-fit:cover; border-radius:10px; margin-bottom:1rem;">` : 
                    '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height:200px; display:flex; align-items:center; justify-content:center; color:white; font-size:4rem; border-radius:10px; margin-bottom:1rem;"><i class="bi bi-headphones"></i></div>'
                }
                <p><strong>Categoría:</strong> ${product.category || 'Sin categoría'}</p>
                <p><strong>Descripción:</strong> ${product.description || 'Sin descripción'}</p>
                <p><strong>Precio:</strong> <span style="color: #6366f1; font-size: 1.5rem; font-weight: bold;">$${product.price.toFixed(2)}</span></p>
                <p><strong>Disponibilidad:</strong> ${stockInfo}</p>
            </div>
        `,
        confirmButtonText: 'Cerrar',
        width: '600px'
    });
}

// Filtrar por categoría
async function filterByCategory(categoryId, button) {
    // Actualizar botones activos
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
    
    currentCategoryFilter = categoryId;
    showLoading(true);
    
    try {
        let products;
        if (categoryId === null) {
            // Mostrar todos
            products = allProducts;
        } else {
            // Filtrar por categoría
            const response = await fetch(`${API_BASE_URL}/Product/category/${categoryId}`);
            if (response.ok) {
                products = await response.json();
            } else {
                products = [];
            }
        }
        
        // Aplicar también el filtro de búsqueda si existe
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        if (searchTerm) {
            products = products.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                (p.description && p.description.toLowerCase().includes(searchTerm))
            );
        }
        
        renderProducts(products);
    } catch (error) {
        console.error('Error al filtrar productos:', error);
        showError('Error al filtrar productos');
    } finally {
        showLoading(false);
    }
}

// Filtrar productos por búsqueda
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let filteredProducts = allProducts;
    
    // Aplicar filtro de categoría si existe
    if (currentCategoryFilter !== null) {
        filteredProducts = filteredProducts.filter(p => p.categoryId === currentCategoryFilter);
    }
    
    // Aplicar filtro de búsqueda
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm)) ||
            (product.category && product.category.toLowerCase().includes(searchTerm))
        );
    }
    
    renderProducts(filteredProducts);
}

// Mostrar estado de carga
function showLoading(show) {
    const loading = document.getElementById('loadingState');
    const grid = document.getElementById('productsGrid');
    const empty = document.getElementById('emptyState');
    
    if (show) {
        loading.style.display = 'block';
        grid.style.display = 'none';
        empty.style.display = 'none';
    } else {
        loading.style.display = 'none';
    }
}

// Mostrar error
function showError(message) {
    Swal.fire({
        title: '¡Error!',
        text: message,
        icon: 'error',
        confirmButtonText: 'Aceptar'
    });
}