const API_URL = 'https://alimentos-santiago.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registroForm = document.getElementById('registroForm');

  // === LOGIN ===
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token);
          alert(`Bienvenido, ${data.nombre}`);
          window.location.href = 'home.html';
        } else {
          alert(data.mensaje || 'Error al iniciar sesión');
        }
      } catch (error) {
        console.error('Error en login:', error);
        alert('No se pudo conectar al servidor');
      }
    });
  }

  // === REGISTRO ===
  if (registroForm) {
    registroForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, email, password })
        });

        const data = await res.json();

        if (res.ok) {
          alert('✅ Registro exitoso. Ahora puedes iniciar sesión.');
          window.location.href = 'login.html';
        } else {
          alert(data.mensaje || '❌ Error en el registro');
        }
      } catch (error) {
        console.error('Error en registro:', error);
        alert('No se pudo conectar al servidor');
      }
    });
  }
});
