const API_URL = 'https://alimentos-santiago.onrender.com/api/dishes';

document.addEventListener('DOMContentLoaded', cargarPlatos);

const form = document.getElementById('platoForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('id').value;
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const precio = parseInt(document.getElementById('precio').value);
  const disponible = document.getElementById('disponible').checked;

  try {
    let res;
    if (id) {
      // Editar
      res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, precio, disponible })
      });
    } else {
      // Agregar
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, precio, disponible })
      });
    }

    const data = await res.json();
    alert(data.mensaje);
    form.reset();
    document.getElementById('id').value = '';
    cargarPlatos();
  } catch (error) {
    console.error('Error al guardar plato:', error);
    alert('Error al guardar plato');
  }
});

async function cargarPlatos() {
  try {
    const res = await fetch(API_URL);
    const platos = await res.json();

    const tabla = document.getElementById('tablaPlatos');
    tabla.innerHTML = '';

    platos.forEach(plato => {
      const fila = `
        <tr>
          <td>${plato.id}</td>
          <td>${plato.nombre}</td>
          <td>$${plato.precio}</td>
          <td>${plato.disponible ? '✔️' : '❌'}</td>
          <td>
            <button onclick='editarPlato(${JSON.stringify(plato)})'>✏️</button>
            <button onclick='eliminarPlato("${plato.id}")'>🗑️</button>
          </td>
        </tr>`;
      tabla.innerHTML += fila;
    });
  } catch (error) {
    console.error('Error al cargar platos:', error);
  }
}

function editarPlato(plato) {
  document.getElementById('id').value = plato.id;
  document.getElementById('nombre').value = plato.nombre;
  document.getElementById('descripcion').value = plato.descripcion;
  document.getElementById('precio').value = plato.precio;
  document.getElementById('disponible').checked = plato.disponible;
}

async function eliminarPlato(id) {
  if (!confirm('¿Estás seguro de eliminar este plato?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    const data = await res.json();
    alert(data.mensaje);
    cargarPlatos();
  } catch (error) {
    console.error('Error al eliminar plato:', error);
    alert('Error al eliminar plato');
  }
}
