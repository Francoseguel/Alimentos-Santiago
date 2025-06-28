import express from 'express';
import { supabase } from '../supabaseClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = 'claveSuperSecreta123';

// Registro de usuario
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Faltan campos' });
  }

  // Verificar si ya existe
  const { data: existe, error: existeError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (existe) {
    return res.status(400).json({ mensaje: 'Usuario ya registrado' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase.from('users').insert([
    { nombre, email, password: hashedPassword, saldo: 10000, admin: false }
  ]);

  if (error) {
    console.error('Error al registrar en Supabase:', error);
    return res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }

  res.json({ mensaje: 'Usuario registrado correctamente' });
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ mensaje: 'Faltan campos' });

  const { data: usuario, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (!usuario) {
    return res.status(401).json({ mensaje: 'Credenciales inválidas' });
  }

  const valido = await bcrypt.compare(password, usuario.password);
  if (!valido) {
    return res.status(401).json({ mensaje: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { email: usuario.email, nombre: usuario.nombre, admin: usuario.admin },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.json({ token, nombre: usuario.nombre, admin: usuario.admin });
});

export default router;
