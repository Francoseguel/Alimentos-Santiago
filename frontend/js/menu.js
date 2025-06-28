window.API_URL = 'https://alimentos-santiago.onrender.com'

async function crearPedido(dish_id, cantidad) {
  const user_id = localStorage.getItem('user_id')

  try {
    const res = await fetch(`${window.API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, dish_id, cantidad })
    })

    const data = await res.json()

    if (res.ok) {
      alert('Pedido creado correctamente')
    } else {
      alert(data.mensaje || 'Error al crear pedido')
    }
  } catch (error) {
    console.error('Error al crear pedido:', error)
    alert('No se pudo conectar al servidor')
  }
}
