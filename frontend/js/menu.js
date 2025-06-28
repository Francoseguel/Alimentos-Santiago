console.log("menu.js cargado ✅");

let carrito = [];

// Función para cargar los platos disponibles desde el backend
async function cargarMenu() {
  try {
    const res = await fetch(`${API_URL}/api/dishes/disponibles`);
    if (!res.ok) {
      alert("Error al cargar el menú.");
      return;
    }

    const platos = await res.json();
    console.log("Platos recibidos:", platos);

    const menuDiv = document.getElementById("menu");
    menuDiv.innerHTML = '';

    platos.forEach(plato => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${plato.nombre}</h3>
        <p>${plato.descripcion}</p>
        <strong>Precio: $${plato.precio}</strong><br>
        <button onclick="agregarAlCarrito(${plato.id}, '${plato.nombre}', ${plato.precio})">
          Agregar al carrito
        </button>
      `;
      menuDiv.appendChild(card);
    });

  } catch (error) {
    console.error("Error al cargar menú:", error);
    alert("No se pudo conectar al servidor.");
  }
}

// Agregar un plato al carrito
function agregarAlCarrito(id, nombre, precio) {
  const existente = carrito.find(item => item.id === id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }
  renderizarCarrito();
}

// Renderiza el carrito en el HTML
function renderizarCarrito() {
  const lista = document.getElementById("carritoLista");
  lista.innerHTML = '';

  carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}`;
    lista.appendChild(li);
  });
}

// Evento para realizar el pedido real
document.getElementById("realizarPedido").addEventListener("click", async () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  const user_id = localStorage.getItem("user_id");
  if (!user_id) {
    alert("Debes iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

  const tipoEntrega = document.getElementById("tipoEntrega").value;
  const fechaHora = document.getElementById("fechaHora").value;
  if (!fechaHora) {
    alert("Debes elegir fecha y hora.");
    return;
  }

  try {
    for (const item of carrito) {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          dish_id: item.id,
          cantidad: item.cantidad
        })
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Error al crear pedido: ${error.mensaje || res.statusText}`);
        return;
      }
    }

    alert("Pedido realizado correctamente ✅");
    carrito = [];
    renderizarCarrito();
  } catch (error) {
    console.error("Error al realizar pedido:", error);
    alert("No se pudo conectar al servidor.");
  }
});

// Ejecutar al cargar la página
cargarMenu();
