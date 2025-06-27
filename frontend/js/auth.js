const API_URL = 'https://alimentos-santiago.onrender.com';

// Función para registrar usuario
async function registrar() {
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log("Intentando registrar:", { nombre, email, password });
  console.log("URL a la que hace fetch:", `${API_URL}/api/auth/register`);


  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, email, password })
    });

    console.log("Respuesta del backend (register):", res);

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error desde backend (register):", errorData);
      alert("Error en registro: " + errorData.mensaje);
      return;
    }

    const data = await res.json();
    console.log("Registro exitoso:", data);
    alert(data.mensaje || "Registro exitoso, ahora inicia sesión");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error en fetch (register):", error);
    alert("No se pudo conectar al servidor: " + error);
  }
}

// Función para iniciar sesión
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log("Intentando login con:", { email, password });

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    console.log("Respuesta del backend (login):", res);

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error desde backend (login):", errorData);
      alert("Error al iniciar sesión: " + errorData.mensaje);
      return;
    }

    const data = await res.json();
    console.log("Login exitoso:", data);
    localStorage.setItem('token', data.token);
    alert("Bienvenido " + data.nombre);
    window.location.href = "home.html";
  } catch (error) {
    console.error("Error en fetch (login):", error);
    alert("No se pudo conectar al servidor: " + error);
  }
}
