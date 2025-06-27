const API_URL = 'http://localhost:3000';

async function cargarPlatosPublicos() {
  try {
    const res = await fetch(`${API_URL}/api/dishes`);
    const platos = await res.json();

    const galeria = document.getElementById('galeria');
    galeria.innerHTML = '';

    platos
      .filter(p => p.disponible)
      .forEach(plato => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
          <h3>${plato.nombre}</h3>
          <p>${plato.descripcion || ''}</p>
          <p class="precio">$${plato.precio}</p>
        `;
        galeria.appendChild(div);
      });

    if (galeria.innerHTML === '') {
      galeria.innerHTML = `<p>No hay platos disponibles actualmente.</p>`;
    }

  } catch (error) {
    console.error("Error al cargar platos:", error);
    document.getElementById('galeria').innerHTML = `<p>Error al cargar los platos.</p>`;
  }
}

cargarPlatosPublicos();
