// Configuración de la API
const API_BASE_URL = 'https://localhost:7157/api';

console.log('=== INICIO DEL SCRIPT ===');
console.log('API URL:', API_BASE_URL);

// Verificar que SweetAlert esté cargado
if (typeof Swal === 'undefined') {
    alert('ERROR: SweetAlert2 no está cargado');
    console.error('SweetAlert2 no está disponible');
} else {
    console.log('✓ SweetAlert2 cargado correctamente');
}

// Verificar que Bootstrap esté cargado
if (typeof bootstrap === 'undefined') {
    alert('ERROR: Bootstrap no está cargado');
    console.error('Bootstrap no está disponible');
} else {
    console.log('✓ Bootstrap cargado correctamente');
}

// Toast para notificaciones rápidas
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

console.log('✓ Toast configurado');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM CARGADO ===');
    
    // Mostrar alerta visual
    Swal.fire({
        title: 'Iniciando...',
        text: 'Cargando panel de administración',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
    });
    
    try {
        console.log('1. Inicializando navegación...');
        initNavigation();
        console.log('✓ Navegación inicializada');
        
        console.log('2. Inicializando listeners de modales...');
        initModalListeners();
        console.log('✓ Listeners de modales inicializados');
        
        console.log('3. Cargando datos del dashboard...');
        loadDashboardData();
        
        console.log('4. Cargando usuarios...');
        loadUsers();
        
        console.log('5. Cargando categorías...');
        loadCategories();
        
        console.log('6. Cargando productos...');
        loadProducts();
        
        console.log('=== INICIALIZACIÓN COMPLETADA ===');
    } catch (error) {
        console.error('ERROR EN LA INICIALIZACIÓN:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de Inicialización',
            text: error.message,
            footer: 'Revisa la consola para más detalles'
        });
    }
});

// ==================== NAVEGACIÓN ====================
function initNavigation() {
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    console.log('Enlaces de navegación encontrados:', navLinks.length);
    
    navLinks.forEach((link, index) => {
        console.log(`Configurando enlace ${index + 1}:`, link.getAttribute('data-section'));
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Click en navegación:', this.getAttribute('data-section'));
            
            // Actualizar enlaces activos
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección correspondiente
            const section = this.getAttribute('data-section');
            document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(section);
            
            if (targetSection) {
                targetSection.classList.add('active');
                console.log('✓ Sección mostrada:', section);
            } else {
                console.error('ERROR: No se encontró la sección:', section);
            }
        });
    });
}

// ==================== MODAL LISTENERS ====================
function initModalListeners() {
    // Listener para modal de usuario
    const userModal = document.getElementById('userModal');
    if (userModal) {
        console.log('✓ Modal de usuario encontrado');
        userModal.addEventListener('hidden.bs.modal', function() {
            console.log('Modal de usuario cerrado - Reseteando formulario');
            document.getElementById('userForm').reset();
            document.getElementById('userId').value = '';
            document.getElementById('userModalTitle').textContent = 'Nuevo Usuario';
            document.getElementById('passwordField').style.display = 'block';
            document.getElementById('userPassword').setAttribute('required', '');
        });
    } else {
        console.error('ERROR: No se encontró el modal de usuario');
    }

    // Listener para modal de categoría
    const categoryModal = document.getElementById('categoryModal');
    if (categoryModal) {
        console.log('✓ Modal de categoría encontrado');
        categoryModal.addEventListener('hidden.bs.modal', function() {
            console.log('Modal de categoría cerrado - Reseteando formulario');
            document.getElementById('categoryForm').reset();
            document.getElementById('categoryId').value = '';
            document.getElementById('categoryModalTitle').textContent = 'Nueva Categoría';
        });
    } else {
        console.error('ERROR: No se encontró el modal de categoría');
    }

    // Listener para modal de producto
    const productModal = document.getElementById('productModal');
    if (productModal) {
        console.log('✓ Modal de producto encontrado');
        productModal.addEventListener('hidden.bs.modal', function() {
            console.log('Modal de producto cerrado - Reseteando formulario');
            document.getElementById('productForm').reset();
            document.getElementById('productId').value = '';
            document.getElementById('productModalTitle').textContent = 'Nuevo Producto';
        });
    } else {
        console.error('ERROR: No se encontró el modal de producto');
    }
}

// ==================== DASHBOARD ====================
async function loadDashboardData() {
    console.log('--- Iniciando carga del dashboard ---');
    
    try {
        console.log('Haciendo peticiones a la API...');
        console.log('URL Usuarios:', `${API_BASE_URL}/User`);
        console.log('URL Productos:', `${API_BASE_URL}/Product`);
        console.log('URL Categorías:', `${API_BASE_URL}/Category`);
        
        const usersPromise = fetch(`${API_BASE_URL}/User`)
            .then(r => {
                console.log('Respuesta usuarios - Status:', r.status);
                if (!r.ok) throw new Error(`Error ${r.status}: ${r.statusText}`);
                return r.json();
            });
        
        const productsPromise = fetch(`${API_BASE_URL}/Product`)
            .then(r => {
                console.log('Respuesta productos - Status:', r.status);
                if (!r.ok) throw new Error(`Error ${r.status}: ${r.statusText}`);
                return r.json();
            });
        
        const categoriesPromise = fetch(`${API_BASE_URL}/Category`)
            .then(r => {
                console.log('Respuesta categorías - Status:', r.status);
                if (!r.ok) throw new Error(`Error ${r.status}: ${r.statusText}`);
                return r.json();
            });
        
        const [users, products, categories] = await Promise.all([
            usersPromise,
            productsPromise,
            categoriesPromise
        ]);
        
        console.log('✓ Datos recibidos:');
        console.log('  - Usuarios:', users.length, users);
        console.log('  - Productos:', products.length, products);
        console.log('  - Categorías:', categories.length, categories);
        
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalCategories').textContent = categories.length;
        
        console.log('✓ Dashboard actualizado correctamente');
    } catch (error) {
        console.error('❌ ERROR en loadDashboardData:', error);
        console.error('Detalles del error:', {
            message: error.message,
            stack: error.stack
        });
        
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar Dashboard',
            text: error.message,
            footer: '<b>Posibles causas:</b><br>1. La API no está corriendo<br>2. URL incorrecta<br>3. Problema de CORS'
        });
    }
}

// ==================== USUARIOS ====================
async function loadUsers() {
    console.log('--- Iniciando carga de usuarios ---');
    
    try {
        const url = `${API_BASE_URL}/User`;
        console.log('Fetch a:', url);
        
        const response = await fetch(url);
        console.log('Respuesta recibida - Status:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const users = await response.json();
        console.log('✓ Usuarios obtenidos:', users.length);
        console.log('Datos:', users);
        
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) {
            console.error('ERROR: No se encontró el tbody de usuarios');
            return;
        }
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4">No hay usuarios registrados</td></tr>';
            console.log('No hay usuarios para mostrar');
            return;
        }
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.userId}</td>
                <td>${user.userName}</td>
                <td>${user.email}</td>
                <td><span class="badge bg-${user.role === 'Admin' ? 'danger' : 'primary'}">${user.role}</span></td>
                <td>${new Date(user.createDate).toLocaleDateString()}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-info" onclick="editUser(${user.userId})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="changePassword(${user.userId})">
                        <i class="bi bi-key"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.userId})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        console.log('✓ Tabla de usuarios renderizada');
    } catch (error) {
        console.error('❌ ERROR en loadUsers:', error);
        Toast.fire({
            icon: 'error',
            title: 'Error al cargar usuarios: ' + error.message
        });
    }
}

async function saveUser() {
    console.log('--- Guardando usuario ---');
    
    const userId = document.getElementById('userId').value;
    const isEdit = userId !== '';
    
    const data = {
        userName: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value
    };
    
    if (!isEdit) {
        data.password = document.getElementById('userPassword').value;
    }
    
    console.log('Datos a enviar:', data);
    console.log('Es edición:', isEdit);
    
    try {
        const url = isEdit ? `${API_BASE_URL}/User/${userId}` : `${API_BASE_URL}/User`;
        const method = isEdit ? 'PUT' : 'POST';
        
        console.log('Petición:', method, url);
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        console.log('Respuesta:', response.status, response.statusText);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al guardar usuario');
        }
        
        Toast.fire({
            icon: 'success',
            title: `Usuario ${isEdit ? 'actualizado' : 'creado'} exitosamente`
        });
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
        modal.hide();
        
        await loadUsers();
        await loadDashboardData();
    } catch (error) {
        console.error('❌ ERROR en saveUser:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    }
}

async function editUser(id) {
    console.log('--- Editando usuario:', id, '---');
    
    try {
        const response = await fetch(`${API_BASE_URL}/User/${id}/ById`);
        
        if (!response.ok) {
            throw new Error('Error al cargar el usuario');
        }
        
        const user = await response.json();
        console.log('Usuario cargado:', user);
        
        document.getElementById('userId').value = user.userId;
        document.getElementById('userName').value = user.userName;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userRole').value = user.role;
        document.getElementById('passwordField').style.display = 'none';
        document.getElementById('userPassword').removeAttribute('required');
        document.getElementById('userModalTitle').textContent = 'Editar Usuario';
        
        const modal = new bootstrap.Modal(document.getElementById('userModal'));
        modal.show();
    } catch (error) {
        console.error('❌ ERROR en editUser:', error);
        Toast.fire({
            icon: 'error',
            title: 'Error al cargar usuario'
        });
    }
}

async function deleteUser(id) {
    console.log('--- Intentando eliminar usuario:', id, '---');
    
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    
    if (result.isConfirmed) {
        try {
            const response = await fetch(`${API_BASE_URL}/User/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Error al eliminar');
            
            Toast.fire({
                icon: 'success',
                title: 'Usuario eliminado exitosamente'
            });
            
            await loadUsers();
            await loadDashboardData();
        } catch (error) {
            console.error('❌ ERROR en deleteUser:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el usuario'
            });
        }
    }
}

async function changePassword(id) {
    const { value: formValues } = await Swal.fire({
        title: 'Cambiar Contraseña',
        html:
            '<input id="swal-input1" class="swal2-input" type="password" placeholder="Contraseña actual">' +
            '<input id="swal-input2" class="swal2-input" type="password" placeholder="Nueva contraseña">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Cambiar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return {
                currentPassword: document.getElementById('swal-input1').value,
                newPassword: document.getElementById('swal-input2').value
            };
        }
    });
    
    if (formValues) {
        try {
            const response = await fetch(`${API_BASE_URL}/User/${id}/change-password`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            
            Toast.fire({
                icon: 'success',
                title: 'Contraseña actualizada exitosamente'
            });
        } catch (error) {
            console.error('❌ ERROR en changePassword:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        }
    }
}

// ==================== CATEGORÍAS ====================
async function loadCategories() {
    console.log('--- Iniciando carga de categorías ---');
    
    try {
        const response = await fetch(`${API_BASE_URL}/Category`);
        console.log('Respuesta categorías:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const categories = await response.json();
        console.log('✓ Categorías obtenidas:', categories.length, categories);
        
        const tbody = document.getElementById('categoriesTableBody');
        
        if (categories.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4">No hay categorías registradas</td></tr>';
        } else {
            tbody.innerHTML = categories.map(cat => `
                <tr>
                    <td>${cat.categoryId}</td>
                    <td>${cat.name}</td>
                    <td>${cat.description}</td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-info" onclick="editCategory(${cat.categoryId})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteCategory(${cat.categoryId})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
        
        updateCategorySelect(categories);
        console.log('✓ Tabla de categorías renderizada');
    } catch (error) {
        console.error('❌ ERROR en loadCategories:', error);
        Toast.fire({
            icon: 'error',
            title: 'Error al cargar categorías: ' + error.message
        });
    }
}

function updateCategorySelect(categories) {
    const select = document.getElementById('productCategory');
    if (select) {
        select.innerHTML = '<option value="">Seleccione una categoría</option>' + 
            categories.map(cat => `<option value="${cat.categoryId}">${cat.name}</option>`).join('');
        console.log('✓ Select de categorías actualizado');
    }
}

async function saveCategory() {
    const categoryId = document.getElementById('categoryId').value;
    const isEdit = categoryId !== '';
    
    const data = {
        name: document.getElementById('categoryName').value,
        description: document.getElementById('categoryDescription').value
    };
    
    try {
        const url = isEdit ? `${API_BASE_URL}/Category/${categoryId}` : `${API_BASE_URL}/Category`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al guardar categoría');
        }
        
        Toast.fire({
            icon: 'success',
            title: `Categoría ${isEdit ? 'actualizada' : 'creada'} exitosamente`
        });
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'));
        modal.hide();
        
        await loadCategories();
        await loadDashboardData();
    } catch (error) {
        console.error('❌ ERROR en saveCategory:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    }
}

async function editCategory(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/Category/${id}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar la categoría');
        }
        
        const category = await response.json();
        
        document.getElementById('categoryId').value = category.categoryId;
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryDescription').value = category.description;
        document.getElementById('categoryModalTitle').textContent = 'Editar Categoría';
        
        const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
        modal.show();
    } catch (error) {
        console.error('❌ ERROR en editCategory:', error);
        Toast.fire({
            icon: 'error',
            title: 'Error al cargar categoría'
        });
    }
}

async function deleteCategory(id) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    
    if (result.isConfirmed) {
        try {
            const response = await fetch(`${API_BASE_URL}/Category/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Error al eliminar');
            
            Toast.fire({
                icon: 'success',
                title: 'Categoría eliminada exitosamente'
            });
            
            await loadCategories();
            await loadDashboardData();
        } catch (error) {
            console.error('❌ ERROR en deleteCategory:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la categoría'
            });
        }
    }
}

// ==================== PRODUCTOS ====================
async function loadProducts() {
    console.log('--- Iniciando carga de productos ---');
    
    try {
        const response = await fetch(`${API_BASE_URL}/Product`);
        console.log('Respuesta productos:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const products = await response.json();
        console.log('✓ Productos obtenidos:', products.length, products);
        
        const tbody = document.getElementById('productsTableBody');
        
        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4">No hay productos registrados</td></tr>';
            return;
        }
        
        tbody.innerHTML = products.map(prod => `
            <tr>
                <td>${prod.productId}</td>
                <td><img src="${prod.imageUrl}" alt="${prod.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22%3E%3Crect fill=%22%23e2e8f0%22 width=%2250%22 height=%2250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22monospace%22 font-size=%2212px%22 fill=%22%2364748b%22%3ENo img%3C/text%3E%3C/svg%3E'"></td>
                <td>${prod.name}</td>
                <td>${prod.price.toFixed(2)}</td>
                <td><span class="badge bg-${prod.stock > 10 ? 'success' : prod.stock > 0 ? 'warning' : 'danger'}">${prod.stock}</span></td>
                <td>${prod.category || 'Sin categoría'}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-info" onclick="editProduct(${prod.productId})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${prod.productId})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        console.log('✓ Tabla de productos renderizada');
    } catch (error) {
        console.error('❌ ERROR en loadProducts:', error);
        Toast.fire({
            icon: 'error',
            title: 'Error al cargar productos: ' + error.message
        });
    }
}

async function saveProduct() {
    const productId = document.getElementById('productId').value;
    const isEdit = productId !== '';
    
    const data = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        categoryId: parseInt(document.getElementById('productCategory').value),
        imageUrl: document.getElementById('productImage').value
    };
    
    try {
        const url = isEdit ? `${API_BASE_URL}/Product/${productId}` : `${API_BASE_URL}/Product`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al guardar producto');
        }
        
        Toast.fire({
            icon: 'success',
            title: `Producto ${isEdit ? 'actualizado' : 'creado'} exitosamente`
        });
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
        modal.hide();
        
        await loadProducts();
        await loadDashboardData();
    } catch (error) {
        console.error('❌ ERROR en saveProduct:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    }
}

async function editProduct(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/Product/${id}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar el producto');
        }
        
        const product = await response.json();
        
        document.getElementById('productId').value = product.productId;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productImage').value = product.imageUrl;
        
        const categoryResponse = await fetch(`${API_BASE_URL}/Category`);
        const categories = await categoryResponse.json();
        updateCategorySelect(categories);
        
        const productCategory = categories.find(c => c.name === product.category);
        if (productCategory) {
            document.getElementById('productCategory').value = productCategory.categoryId;
        }
        
        document.getElementById('productModalTitle').textContent = 'Editar Producto';
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    } catch (error) {
        console.error('❌ ERROR en editProduct:', error);
        Toast.fire({
            icon: 'error',
            title: 'Error al cargar producto'
        });
    }
}

async function deleteProduct(id) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    
    if (result.isConfirmed) {
        try {
            const response = await fetch(`${API_BASE_URL}/Product/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Error al eliminar');
            
            Toast.fire({
                icon: 'success',
                title: 'Producto eliminado exitosamente'
            });
            
            await loadProducts();
            await loadDashboardData();
        } catch (error) {
            console.error('❌ ERROR en deleteProduct:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el producto'
            });
        }
    }
}

console.log('=== FIN DEL SCRIPT - Esperando DOM ===');