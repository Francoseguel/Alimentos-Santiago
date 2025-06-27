const API_URL = 'http://localhost:3000';
let platosSeleccionados = [];

const token = localStorage.getItem('token');
if (!token) {
  alert("Debes iniciar sesión.");
  window.location.href = 'login.html';
}

async function cargarMenu() {
  try {
    const res = await fetch(`${API_URL}/api/dishes`);
    const platos = await res.json();

    const menuDiv = document.getElementById('menu');
    menuDiv.innerHTML = '';

    platos
      .filter(p => p.disponible)
      .forEach(plato => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
          <h3>${plato.nombre}</h3>
          <p>${plato.descripcion || ''}</p>
          <p class="precio">$${plato.precio}</p>
          <button onclick="agregarAlCarrito(${plato.id}, '${plato.nombre}')">Agregar</button>
        `;
        menuDiv.appendChild(div);
      });
  } catch (error) {
    console.error("Error al cargar el menú:", error);
  }
}

function agregarAlCarrito(id, nombre) {
  platosSeleccionados.push(id);
  const carrito = document.getElementById('carritoLista');
  const li = document.createElement('li');
  li.textContent = nombre;
  carrito.appendChild(li);
}

document.getElementById('realizarPedido').addEventListener('click', async () => {
  const tipoEntrega = document.getElementById('tipoEntrega').value;
  const fechaHora = document.getElementById('fechaHora').value;

  const payload = JSON.parse(atob(token.split('.')[1]));
  const email = payload.email;

  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      platos: platosSeleccionados,
      tipoEntrega,
      fechaHora
    })
  });

  const data = await res.json();
  if (res.ok) {
    alert('✅ Pedido realizado correctamente');
    platosSeleccionados = [];
    document.getElementById('carritoLista').innerHTML = '';
  } else {
    alert(data.mensaje || '❌ Error al hacer el pedido');
  }
});

function cerrarSesion() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

cargarMenu();
