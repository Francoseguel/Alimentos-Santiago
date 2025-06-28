console.log("cuenta.js cargado ✅");

const API_URL = "https://alimentos-santiago.onrender.com/api";

async function cargarPedidos() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const email = payload.email;

    const res = await fetch(`${API_URL}/orders/${email}`);
    const pedidos = await res.json();

    const tabla = document.getElementById("tablaPedidos");
    tabla.innerHTML = "";

    pedidos.forEach(p => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${p.id}</td>
        <td>${p.plato}</td>
        <td>${p.cantidad}</td>
        <td>${p.fecha}</td>
      `;
      tabla.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
  }
}

cargarPedidos();
