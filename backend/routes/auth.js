import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { supabase } from '../supabaseClient.js'

const router = express.Router()
const SECRET_KEY = 'claveSuperSecreta123' // idealmente usar env

// Registro
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body

  if (!nombre || !email || !password)
    return res.status(400).json({ mensaje: 'Faltan campos' })

  const { data: existe } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (existe) {
    return res.status(400).json({ mensaje: 'Usuario ya registrado' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const { error } = await supabase.from('users').insert([
    { nombre, email, password: hashedPassword, saldo: 10000, admin: false }
  ])

  if (error) {
    console.error("Error insertando usuario:", error)
    return res.status(500).json({ mensaje: 'Error al registrar usuario' })
  }

  res.json({ mensaje: 'Usuario registrado correctamente' })
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const { data: usuario } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (!usuario)
    return res.status(401).json({ mensaje: 'Credenciales inválidas' })

  const valido = await bcrypt.compare(password, usuario.password)
  if (!valido)
    return res.status(401).json({ mensaje: 'Credenciales inválidas' })

  const token = jwt.sign(
    { email: usuario.email, nombre: usuario.nombre, admin: usuario.admin || false },
    SECRET_KEY,
    { expiresIn: '1h' }
  )

  res.json({ 
    token, 
    nombre: usuario.nombre, 
    admin: usuario.admin || false,
    id: usuario.id // enviar id del usuario
  })
})

export default router
