import express from 'express';
import fs from 'fs-extra';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const USERS_FILE = './data/users.json';
const SECRET_KEY = 'claveSuperSecreta123';

// Registro de usuario
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password)
    return res.status(400).json({ mensaje: 'Faltan campos' });

  const usuarios = await fs.readJSON(USERS_FILE).catch(() => []);
  const existente = usuarios.find(u => u.email === email);
  if (existente)
    return res.status(400).json({ mensaje: 'Usuario ya registrado' });

  const hashedPassword = await bcrypt.hash(password, 10);
  usuarios.push({ nombre, email, password: hashedPassword, saldo: 10000, admin: false });
  await fs.writeJSON(USERS_FILE, usuarios);

  res.json({ mensaje: 'Usuario registrado correctamente' });
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const usuarios = await fs.readJSON(USERS_FILE).catch(() => []);
  const usuario = usuarios.find(u => u.email === email);
  if (!usuario)
    return res.status(401).json({ mensaje: 'Credenciales inválidas' });

  const valido = await bcrypt.compare(password, usuario.password);
  if (!valido)
    return res.status(401).json({ mensaje: 'Credenciales inválidas' });

  const token = jwt.sign(
    {
      email: usuario.email,
      nombre: usuario.nombre,
      admin: usuario.admin || false
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.json({ token, nombre: usuario.nombre, admin: usuario.admin || false });
});

export default router;
