import express from 'express';
import fs from 'fs-extra';
import { verificarToken, soloAdmin } from '../middleware/auth.js';

const router = express.Router();
const FILE = './data/dishes.json';

// Obtener todos los platos
router.get('/', async (req, res) => {
  const platos = await fs.readJSON(FILE).catch(() => []);
  res.json(platos);
});

// Crear nuevo plato
router.post('/', verificarToken, soloAdmin, async (req, res) => {
  const { nombre, descripcion, precio, disponible } = req.body;
  if (!nombre || !descripcion || !precio) {
    return res.status(400).json({ mensaje: 'Campos incompletos' });
  }

  const platos = await fs.readJSON(FILE).catch(() => []);
  const nuevo = {
    id: platos.length ? platos[platos.length - 1].id + 1 : 1,
    nombre,
    descripcion,
    precio,
    disponible: disponible ?? true
  };

  platos.push(nuevo);
  await fs.writeJSON(FILE, platos);
  res.status(201).json(nuevo);
});

// Actualizar plato
router.put('/:id', verificarToken, soloAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, descripcion, precio, disponible } = req.body;

  const platos = await fs.readJSON(FILE).catch(() => []);
  const index = platos.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ mensaje: 'Plato no encontrado' });
  }

  platos[index] = { id, nombre, descripcion, precio, disponible: disponible ?? true };
  await fs.writeJSON(FILE, platos);
  res.json(platos[index]);
});

// Eliminar plato
router.delete('/:id', verificarToken, soloAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  let platos = await fs.readJSON(FILE).catch(() => []);
  const existe = platos.find(p => p.id === id);
  if (!existe) return res.status(404).json({ mensaje: 'Plato no encontrado' });

  platos = platos.filter(p => p.id !== id);
  await fs.writeJSON(FILE, platos);
  res.json({ mensaje: 'Plato eliminado' });
});

export default router;
