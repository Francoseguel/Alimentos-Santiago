const API_URL = 'http://localhost:3000';
const token = localStorage.getItem('token');

if (!token) {
  alert('Debes iniciar sesión como administrador.');
  window.location.href = 'login.html';
}

const payload = JSON.parse(atob(token.split('.')[1]));
if (!payload.admin) {
  alert('Acceso denegado: No eres administrador.');
  window.location.href = 'login.html';
}

async function cargarPlatos() {
  const res = await fetch(`${API_URL}/api/dishes`);
  const platos = await res.json();

  const tbody = document.getElementById('tablaPlatos');
  tbody.innerHTML = '';

  platos.forEach(plato => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${plato.id}</td>
      <td>${plato.nombre}</td>
      <td>$${plato.precio}</td>
      <td>${plato.disponible ? '✔️' : '❌'}</td>
      <td>
        <button onclick="editarPlato(${plato.id})">✏️</button>
        <button onclick="eliminarPlato(${plato.id})">🗑️</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

document.getElementById('platoForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('id').value;
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const precio = parseInt(document.getElementById('precio').value);
  const disponible = document.getElementById('disponible').checked;

  const metodo = id ? 'PUT' : 'POST';
  const endpoint = id ? `${API_URL}/api/dishes/${id}` : `${API_URL}/api/dishes`;

  const res = await fetch(endpoint, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ nombre, descripcion, precio, disponible })
  });

  const data = await res.json();
  if (res.ok) {
    alert(id ? '✅ Plato actualizado' : '✅ Plato agregado');
    document.getElementById('platoForm').reset();
    cargarPlatos();
  } else {
    alert(data.mensaje || '❌ Error al guardar el plato');
  }
});

async function editarPlato(id) {
  const res = await fetch(`${API_URL}/api/dishes`);
  const platos = await res.json();
  const plato = platos.find(p => p.id === id);

  document.getElementById('id').value = plato.id;
  document.getElementById('nombre').value = plato.nombre;
  document.getElementById('descripcion').value = plato.descripcion;
  document.getElementById('precio').value = plato.precio;
  document.getElementById('disponible').checked = plato.disponible || false;
}

async function eliminarPlato(id) {
  if (!confirm('¿Eliminar este plato?')) return;

  const res = await fetch(`${API_URL}/api/dishes/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  if (res.ok) {
    alert('🗑️ Plato eliminado');
    cargarPlatos();
  } else {
    alert(data.mensaje || '❌ Error al eliminar');
  }
}

function cerrarSesion() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

cargarPlatos();
