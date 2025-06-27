const API_URL = 'https://alimentos-santiago.onrender.com';

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log("Intentando login con:", { email, password });
  console.log("URL a la que hace fetch:", `${API_URL}/api/auth/login`);

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const text = await res.text();
    console.log("Respuesta raw:", text);

    let data;
    try {
      data = JSON.parse(text);
      console.log("Respuesta parseada:", data);
    } catch (e) {
      console.error("No es JSON válido:", e);
    }

    if (res.ok) {
      localStorage.setItem('token', data.token);
      alert('Login exitoso');
      window.location.href = 'home.html';
    } else {
      alert((data && data.mensaje) || "Error al iniciar sesión");
    }
  } catch (error) {
    console.error("Error en fetch (login):", error);
    alert("No se pudo conectar al servidor: " + error);
  }
}

async function registrar() {
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log("Intentando registrar:", { nombre, email, password });
  console.log("URL a la que hace fetch:", `${API_URL}/api/auth/register`);

  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });

    const text = await res.text();
    console.log("Respuesta raw:", text);

    let data;
    try {
      data = JSON.parse(text);
      console.log("Respuesta parseada:", data);
    } catch (e) {
      console.error("No es JSON válido:", e);
    }

    if (res.ok) {
      alert('Registro exitoso, ahora puedes iniciar sesión');
      window.location.href = 'login.html';
    } else {
      alert((data && data.mensaje) || "Error al registrarse");
    }
  } catch (error) {
    console.error("Error en fetch (register):", error);
    alert("No se pudo conectar al servidor: " + error);
  }
}
