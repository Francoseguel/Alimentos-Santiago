window.API_URL = 'https://alimentos-santiago.onrender.com'

async function login() {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  try {
    const res = await fetch(`${window.API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user_id', data.id) // guardar id del usuario
      alert('Login exitoso')
      window.location.href = 'home.html'
    } else {
      alert(data.mensaje || 'Error al iniciar sesión')
    }
  } catch (error) {
    console.error('Error en login:', error)
    alert('No se pudo conectar al servidor')
  }
}

async function registrar() {
  const nombre = document.getElementById('nombre').value
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  try {
    const res = await fetch(`${window.API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    })

    const data = await res.json()

    if (res.ok) {
      alert('Registro exitoso, ahora puedes iniciar sesión')
      window.location.href = 'login.html'
    } else {
      alert(data.mensaje || 'Error al registrarse')
    }
  } catch (error) {
    console.error('Error en registro:', error)
    alert('No se pudo conectar al servidor')
  }
}

function cerrarSesion() {
  localStorage.removeItem('token')
  localStorage.removeItem('user_id')
  location.href = 'index.html'
}
