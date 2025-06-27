const API_URL = 'http://localhost:3000';
const token = localStorage.getItem('token');

if (!token) {
  alert('Debes iniciar sesión.');
  window.location.href = 'login.html';
}

const payload = JSON.parse(atob(token.split('.')[1]));
const email = payload.email;

let mapaPlatos = {};

async function cargarPlatos() {
  const res = await fetch(`${API_URL}/api/dishes`);
  const platos = await res.json();
  // Creamos un mapa con ID => nombre
  platos.forEach(plato => {
    mapaPlatos[plato.id] = plato.nombre;
  });
}

async function cargarCuenta() {
  const res = await fetch(`${API_URL}/api/orders/cuenta/${email}`);
  const data = await res.json();

  if (!res.ok) {
    alert(data.mensaje || 'Error al cargar cuenta');
    return;
  }

  document.getElementById('nombre').textContent = data.nombre;
  document.getElementById('email').textContent = data.email;
  document.getElementById('saldo').textContent = data.saldo;

  const tbody = document.getElementById('tablaPedidos');
  tbody.innerHTML = '';

  data.pedidos.forEach(pedido => {
    const nombresPlatos = pedido.platos.map(id => mapaPlatos[id] || `ID:${id}`);
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${pedido.id}</td>
      <td>${new Date(pedido.fechaHora).toLocaleString()}</td>
      <td>${pedido.tipoEntrega}</td>
      <td>${nombresPlatos.join(', ')}</td>
      <td>${pedido.estado}</td>
    `;
    tbody.appendChild(fila);
  });
}

function cerrarSesion() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

(async () => {
  await cargarPlatos();
  await cargarCuenta();
})();
