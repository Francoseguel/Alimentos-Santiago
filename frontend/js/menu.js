console.log("menu.js cargado ✅");

const API_URL = "https://alimentos-santiago.onrender.com/api";
let carrito = [];

// Mostrar platos
async function cargarPlatos() {
  try {
    const res = await fetch(`${API_URL}/dishes`);
    const platos = await res.json();
    const contenedor = document.getElementById("platos");
    contenedor.innerHTML = "";

    platos.forEach(plato => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h3>${plato.nombre}</h3>
        <p>${plato.descripcion}</p>
        <p><strong>Precio:</strong> $${plato.precio}</p>
        <button onclick='agregarAlCarrito(${JSON.stringify(plato)})'>Agregar al carrito</button>
      `;
      contenedor.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar platos:", error);
  }
}

cargarPlatos();

// Agregar al carrito
function agregarAlCarrito(plato) {
  console.log("Agregando al carrito:", plato);
  carrito.push(plato);
  alert(`Plato "${plato.nombre}" agregado al carrito`);
}

// Enviar pedido
async function realizarPedido() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión.");
    return;
  }

  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  const payload = JSON.parse(atob(token.split('.')[1]));

  const tipoEntrega = document.getElementById("tipoEntrega").value;
  const fechaHora = document.getElementById("fechaHora").value;

  const datos = {
    email: payload.email,
    platos: carrito,
    tipoEntrega,
    fechaHora
  };

  console.log("Enviando pedido:", datos);

  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
    const respuesta = await res.json();
    alert(respuesta.mensaje || "Pedido realizado con éxito");

    carrito = []; // Limpiar carrito
  } catch (error) {
    console.error("Error al realizar pedido:", error);
    alert("Error al enviar pedido");
  }
}
