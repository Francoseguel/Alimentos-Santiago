window.API_URL = 'https://alimentos-santiago.onrender.com'

async function cargarPedidos() {
  const user_id = localStorage.getItem('user_id')

  try {
    const res = await fetch(`${window.API_URL}/api/orders/user/${user_id}`)
    const pedidos = await res.json()

    // ejemplo: mostrar en consola o renderizar en HTML
    console.log('Pedidos:', pedidos)

    // Aquí puedes crear tabla o lista para mostrar los pedidos
  } catch (error) {
    console.error('Error al obtener pedidos:', error)
    alert('No se pudo conectar al servidor')
  }
}
