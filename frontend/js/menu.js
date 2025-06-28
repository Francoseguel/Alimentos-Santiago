console.log('menu.js cargado ✅');

const API_URL = 'https://alimentos-santiago.onrender.com'; // Ajusta si cambia tu dominio
let carrito = [];

// Esperar a que cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
  cargarPlatos();

  // Evento para mostrar campos extra si elige "Domicilio"
  document.getElementById('tipoEntrega').addEventListener('change', mostrarCamposDomicilio);

  // Evento para crear pedido
  document.getElementById('realizarPedidoBtn').addEventListener('click', crearPedido);
});

// =====================
// Cargar platos disponibles
// =====================
async function cargarPlatos() {
  try {
    const res = await fetch(`${API_URL}/api/dishes`);
    const platos = await res.json();

    console.log('Platos cargados:', platos);

    const lista = document.getElementById('listaPlatos');
    lista.innerHTML = '';

    platos.forEach(plato => {
      const card = document.createElement('div');
      card.className = 'plato-card';
      card.innerHTML = `
        <h3>${plato.nombre}</h3>
        <p>${plato.descripcion}</p>
        <p><strong>Precio:</strong> $${plato.precio}</p>
        <button onclick="agregarAlCarrito('${plato.id}','${plato.nombre}', ${plato.precio})">Agregar al carrito</button>
      `;
      lista.appendChild(card);
    });
  } catch (error) {
    console.error('Error al cargar platos:', error);
    alert('No se pudieron cargar los platos');
  }
}

// =====================
// Agregar plato al carrito
// =====================
function agregarAlCarrito(id, nombre, precio) {
  carrito.push({ id, nombre, precio });
  renderizarCarrito();
}

// =====================
// Mostrar carrito
// =====================
function renderizarCarrito() {
  const carritoDiv = document.getElementById('carrito');
  carritoDiv.innerHTML = '';

  carrito.forEach((item, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      ${item.nombre} - $${item.precio} 
      <button onclick="quitarDelCarrito(${index})">Quitar</button>
    `;
    carritoDiv.appendChild(div);
  });
}

// =====================
// Quitar item del carrito
// =====================
function quitarDelCarrito(index) {
  carrito.splice(index, 1);
  renderizarCarrito();
}

// =====================
// Mostrar campos adicionales si tipoEntrega = Domicilio
// =====================
function mostrarCamposDomicilio() {
  const tipo = document.getElementById('tipoEntrega').value;
  const extraDiv = document.getElementById('datosDomicilio');

  if (tipo === 'Domicilio') {
    extraDiv.innerHTML = `
      <input type="text" id="direccion" placeholder="Dirección" required><br>
      <input type="text" id="telefono" placeholder="Teléfono de contacto" required><br>
    `;
  } else {
    extraDiv.innerHTML = ''; // Ocultar campos
  }
}

// =====================
// Crear pedido
// =====================
async function crearPedido() {
  const user_email = localStorage.getItem('user_email'); // O el campo que guardaste
  const tipoEntrega = document.getElementById('tipoEntrega').value;
  const fechaHora = document.getElementById('fechaHora').value;

  let direccion = '';
  let telefono = '';

  if (tipoEntrega === 'Domicilio') {
    direccion = document.getElementById('direccion').value;
    telefono = document.getElementById('telefono').value;
  }

  console.log({ user_email, carrito, tipoEntrega, fechaHora, direccion, telefono });

  if (!user_email || carrito.length === 0 || !fechaHora || !tipoEntrega) {
    alert('Faltan datos para el pedido');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_email,
        platos: carrito,
        tipoEntrega,
        fechaHora,
        direccion,
        telefono
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Pedido realizado correctamente');
      carrito = [];
      renderizarCarrito();
    } else {
      console.error('Error al crear pedido:', data);
      alert(data.mensaje || 'Error al crear pedido');
    }
  } catch (error) {
    console.error('Error en fetch (crear pedido):', error);
    alert('No se pudo conectar con el servidor');
  }
}
