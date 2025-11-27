// Configuración de la API
const API_BASE_URL = 'https://localhost:7157/api';

// Función para cambiar entre tabs - VERSION SIMPLIFICADA
window.switchTab = function(tab, clickedButton) {
    console.log('=== switchTab EJECUTADO ===');
    console.log('Tab solicitado:', tab);
    console.log('Botón clickeado:', clickedButton);
    
    try {
        // Remover active de todos los botones
        const allButtons = document.querySelectorAll('.tab-btn');
        console.log('Botones encontrados:', allButtons.length);
        allButtons.forEach(btn => btn.classList.remove('active'));
        
        // Activar el botón clickeado
        if (clickedButton) {
            clickedButton.classList.add('active');
            console.log('Botón activado');
        }
        
        // Ocultar todos los formularios
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        console.log('loginForm encontrado:', !!loginForm);
        console.log('registerForm encontrado:', !!registerForm);
        
        loginForm.classList.remove('active');
        registerForm.classList.remove('active');
        
        // Mostrar el formulario correcto
        if (tab === 'login') {
            loginForm.classList.add('active');
            console.log('Mostrando LOGIN');
        } else if (tab === 'register') {
            registerForm.classList.add('active');
            console.log('Mostrando REGISTER');
        }
        
        console.log('=== switchTab COMPLETADO ===');
    } catch (error) {
        console.error('ERROR en switchTab:', error);
    }
};

// Función para mostrar/ocultar contraseña
function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}

// Función para mostrar alertas con SweetAlert2
function showAlert(message, type = 'error') {
    const config = {
        title: type === 'success' ? '¡Éxito!' : type === 'warning' ? 'Atención' : '¡Error!',
        text: message,
        icon: type === 'danger' ? 'error' : type,
        confirmButtonText: 'Aceptar',
        timer: type === 'success' ? 2000 : undefined,
        timerProgressBar: type === 'success',
        showConfirmButton: type !== 'success'
    };
    
    Swal.fire(config);
}

// Función para limpiar alertas (ya no es necesaria con SweetAlert2, pero la dejamos por compatibilidad)
function clearAlert() {
    // SweetAlert2 maneja el cierre automáticamente
}

// Función para cambiar estado del botón (loading)
function setButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"></span>
            Procesando...
        `;
    } else {
        button.disabled = false;
        if (buttonId === 'loginBtn') {
            button.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión';
        } else {
            button.innerHTML = '<i class="bi bi-person-plus"></i> Crear Cuenta';
        }
    }
}

// Manejar Login
async function handleLogin(event) {
    event.preventDefault();
    clearAlert();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validaciones básicas
    if (!email || !password) {
        showAlert('Por favor completa todos los campos');
        return;
    }
    
    setButtonLoading('loginBtn', true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login exitoso
            Swal.fire({
                title: '¡Bienvenido!',
                text: 'Inicio de sesión exitoso',
                icon: 'success',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false
            });
            
            // Guardar datos del usuario en localStorage
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userName', data.userName);
            
            // Redirigir según el rol
            setTimeout(() => {
                if (data.role === 'Admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'user.html';
                }
            }, 1500);
            
        } else {
            // Error en login
            showAlert(data.message || 'Email o contraseña incorrectos');
        }
        
    } catch (error) {
        console.error('Error en login:', error);
        showAlert('Error al conectar con el servidor. Por favor intenta nuevamente.');
    } finally {
        setButtonLoading('loginBtn', false);
    }
}

// Manejar Registro
async function handleRegister(event) {
    event.preventDefault();
    clearAlert();
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validaciones
    if (!username || !email || !password || !confirmPassword) {
        showAlert('Por favor completa todos los campos');
        return;
    }
    
    if (password.length < 6) {
        showAlert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Las contraseñas no coinciden');
        return;
    }
    
    setButtonLoading('registerBtn', true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/User`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: username,
                email: email,
                password: password
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Registro exitoso
            Swal.fire({
                title: '¡Cuenta Creada!',
                text: 'Ahora puedes iniciar sesión',
                icon: 'success',
                confirmButtonText: 'Continuar',
                timer: 3000,
                timerProgressBar: true
            }).then(() => {
                // Limpiar formulario
                document.getElementById('registerUsername').value = '';
                document.getElementById('registerEmail').value = '';
                document.getElementById('registerPassword').value = '';
                document.getElementById('registerConfirmPassword').value = '';
                
                // Cambiar a tab de login manualmente
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-btn')[0].classList.add('active');
                document.querySelectorAll('.form-section').forEach(section => section.classList.remove('active'));
                document.getElementById('loginForm').classList.add('active');
                document.getElementById('loginEmail').value = email;
            });
            
        } else {
            // Error en registro
            const errorData = await response.json();
            showAlert(errorData.message || 'Error al crear la cuenta. Verifica tus datos.');
        }
        
    } catch (error) {
        console.error('Error en registro:', error);
        showAlert('Error al conectar con el servidor. Por favor intenta nuevamente.');
    } finally {
        setButtonLoading('registerBtn', false);
    }
}

// Verificar si ya hay sesión activa al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        // Si ya hay sesión, redirigir
        if (userData.role === 'Admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'user.html';
        }
    }
});