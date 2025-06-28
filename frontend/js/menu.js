const API_URL = 'https://alimentos-santiago.onrender.com/api';

let carrito = []; // platos agregados al carrito

document.addEventListener('DOMContentLoaded', cargarPlatos);

async function cargarPlatos() {
  try {
    const res = await fetch(`${API_URL}/dishes`);
    const platos = await res.json();

    const contenedor = document.getElementById('platos');
    contenedor.innerHTML = '';

    platos.forEach(plato => {
      const card = document.createElement('div');
      card.className = 'plato';
      card.innerHTML = `
        <h3>${plato.nombre}</h3>
        <p>${plato.descripcion}</p>
        <p><strong>Precio:</strong> $${plato.precio}</p>
        <button onclick='agregarAlCarrito(${JSON.stringify(plato)})'>Agregar al carrito</button>
      `;
      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error('Error al cargar platos:', error);
  }
}

function agregarAlCarrito(plato) {
  carrito.push(plato);
  renderCarrito();
}

function renderCarrito() {
  const contenedor = document.getElementById('carrito');
  contenedor.innerHTML = '';

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p>El carrito está vacío.</p>';
    return;
  }

  carrito.forEach((item, index) => {
    const div = document.createElement('div');
    div.innerHTML = `${item.nombre} - $${item.precio} 
      <button onclick="quitarDelCarrito(${index})">Quitar</button>`;
    contenedor.appendChild(div);
  });
}

function quitarDelCarrito(index) {
  carrito.splice(index, 1);
  renderCarrito();
}

async function realizarPedido() {
  const tipoEntrega = document.getElementById('tipoEntrega').value;
  const fechaHora = document.getElementById('fechaHora').value;

  if (carrito.length === 0) {
    alert('Agrega al menos un plato al carrito.');
    return;
  }
  if (!fechaHora) {
    alert('Selecciona fecha y hora.');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platos: carrito.map(p => p.id),
        tipoEntrega,
        fechaHora
      })
    });
    const data = await res.json();

    if (res.ok) {
      alert('Pedido creado con éxito.');
      carrito = [];
      renderCarrito();
    } else {
      alert(data.mensaje || 'Error al crear pedido');
    }
  } catch (error) {
    console.error('Error al crear pedido:', error);
    alert('Error al crear pedido');
  }
}
