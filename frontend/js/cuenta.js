console.log("cuenta.js cargado ✅");

async function cargarPedidos() {
  const user_id = localStorage.getItem("user_id");
  if (!user_id) {
    alert("Debes iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/orders/user/${user_id}`);
    if (!res.ok) {
      alert("No se pudo cargar el historial de pedidos.");
      return;
    }

    const pedidos = await res.json();
    console.log("Pedidos recibidos:", pedidos);

    const cuerpo = document.getElementById("cuerpoTabla");
    cuerpo.innerHTML = '';

    pedidos.forEach(pedido => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${pedido.id}</td>
        <td>${pedido.dish_id}</td>
        <td>${pedido.cantidad}</td>
        <td>${new Date(pedido.fecha).toLocaleString()}</td>
      `;
      cuerpo.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
    alert("Error al conectar con el servidor.");
  }
}

// Ejecuta al cargar la página
cargarPedidos();
