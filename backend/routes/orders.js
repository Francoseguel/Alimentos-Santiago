import express from 'express';
import fs from 'fs-extra';

const router = express.Router();
const ORDERS_FILE = './data/orders.json';

// Crear un nuevo pedido
router.post('/', async (req, res) => {
  const { email, platos, tipoEntrega, fechaHora } = req.body;

  if (!email || !platos || platos.length === 0)
    return res.status(400).json({ mensaje: 'Datos incompletos' });

  const pedidos = await fs.readJSON(ORDERS_FILE).catch(() => []);
  const nuevoPedido = {
    id: pedidos.length + 1,
    email,
    platos,
    tipoEntrega,
    fechaHora,
    estado: 'Pendiente'
  };

  pedidos.push(nuevoPedido);
  await fs.writeJSON(ORDERS_FILE, pedidos);
  res.json({ mensaje: 'Pedido registrado', pedido: nuevoPedido });
});

// Obtener pedidos por cliente
router.get('/:email', async (req, res) => {
  const { email } = req.params;
  const pedidos = await fs.readJSON(ORDERS_FILE).catch(() => []);
  const resultado = pedidos.filter(p => p.email === email);
  res.json(resultado);
});

// Obtener saldo y pedidos por cliente
router.get('/cuenta/:email', async (req, res) => {
  const { email } = req.params;

  const pedidos = await fs.readJSON('./data/orders.json').catch(() => []);
  const usuarios = await fs.readJSON('./data/users.json').catch(() => []);

  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  const historial = pedidos.filter(p => p.email === email);

  res.json({
    nombre: usuario.nombre,
    email: usuario.email,
    saldo: usuario.saldo,
    pedidos: historial
  });
});

export default router;
