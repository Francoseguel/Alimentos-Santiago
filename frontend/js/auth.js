// Cambia por tu dominio de Render
const API_URL = 'https://alimentos-santiago.onrender.com';

async function register() {
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log('Intentando registrar:', { nombre, email, password });

  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });

    const data = await res.json();
    console.log('Respuesta register:', data);

    if (res.ok) {
      alert(data.mensaje || 'Registro exitoso');
      window.location.href = 'login.html';
    } else {
      alert(data.mensaje || 'Error en registro');
    }
  } catch (error) {
    console.error('Error en fetch (register):', error);
    alert('No se pudo conectar al servidor');
  }
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log('Intentando login con:', { email, password });
  console.log('URL a la que hace fetch:', `${API_URL}/api/auth/login`);

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log('Respuesta login:', data);

    if (res.ok) {
      localStorage.setItem('token', data.token);
      alert('Login exitoso');
      window.location.href = 'home.html';
    } else {
      alert(data.mensaje || 'Error en login');
    }
  } catch (error) {
    console.error('Error en fetch (login):', error);
    alert('No se pudo conectar al servidor');
  }
}
