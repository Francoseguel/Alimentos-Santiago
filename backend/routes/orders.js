import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Crear pedido
router.post('/', async (req, res) => {
  const { user_id, dish_id, cantidad } = req.body;

  if (!user_id || !dish_id || !cantidad) {
    return res.status(400).json({ mensaje: 'Faltan campos' });
  }

  const { error } = await supabase
    .from('orders')
    .insert([{ user_id, dish_id, cantidad, fecha: new Date().toISOString() }]);

  if (error) {
    console.error("Error al crear pedido:", error);
    return res.status(500).json({ mensaje: 'Error al crear pedido' });
  }

  res.json({ mensaje: 'Pedido creado correctamente' });
});

// Obtener pedidos de un usuario
router.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user_id)
    .order('fecha', { ascending: false });

  if (error) {
    console.error("Error al obtener pedidos del usuario:", error);
    return res.status(500).json({ mensaje: 'Error al obtener pedidos' });
  }

  res.json(data);
});

// (Opcional) Obtener todos los pedidos (admin)
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('fecha', { ascending: false });

  if (error) {
    console.error("Error al obtener todos los pedidos:", error);
    return res.status(500).json({ mensaje: 'Error al obtener pedidos' });
  }

  res.json(data);
});

export default router;
