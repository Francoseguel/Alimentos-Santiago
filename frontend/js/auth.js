console.log("auth.js cargado ✅");

async function registrar() {
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  console.log("Intentando registrar:", { nombre, email, password });

  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(`Error en registro: ${error.mensaje || res.statusText}`);
      return;
    }

    const data = await res.json();
    alert(data.mensaje || "Registro exitoso ✅");
    window.location.href = "login.html";
  } catch (err) {
    console.error("Error en fetch (register):", err);
    alert("No se pudo conectar al servidor.");
  }
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  console.log("Intentando login con:", { email, password });
  console.log("URL a la que hace fetch:", `${API_URL}/api/auth/login`);

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(`Error en login: ${error.mensaje || res.statusText}`);
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    alert("Login exitoso ✅");
    window.location.href = "home.html";
  } catch (err) {
    console.error("Error en fetch (login):", err);
    alert("No se pudo conectar al servidor.");
  }
}
