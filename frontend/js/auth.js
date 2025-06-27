// frontend/js/auth.js

const API_URL = 'https://alimentos-santiago.onrender.com';  // Cambia por tu URL de Render si no es esta

// Función para registrar usuario
async function registrar() {
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, email, password })
    });

    if (!res.ok) {
      // Intenta leer el error del backend
      const errorData = await res.json();
      alert("Error en registro: " + errorData.mensaje);
      return;
    }

    const data = await res.json();
    alert(data.mensaje || "Registro exitoso, ahora inicia sesión");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error en registro:", error);
    alert("No se pudo conectar al servidor: " + error);
  }
}

// Función para iniciar sesión
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert("Error al iniciar sesión: " + errorData.mensaje);
      return;
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);
    alert("Bienvenido " + data.nombre);
    window.location.href = "home.html";  // O donde quieras redirigir tras login
  } catch (error) {
    console.error("Error en login:", error);
    alert("No se pudo conectar al servidor: " + error);
  }
}
