import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Crear pedido
router.post('/', async (req, res) => {
  const { email, platos, tipoEntrega, fechaHora } = req.body;

  if (!email || !platos || platos.length === 0) {
    return res.status(400).json({ mensaje: 'Faltan datos del pedido' });
  }

  const { error } = await supabase.from('orders').insert([
    {
      email,
      platos: JSON.stringify(platos),  // Guardamos platos como JSON string
      tipoEntrega,
      fechaHora
    }
  ]);

  if (error) {
    console.error("Error al crear pedido:", error);
    return res.status(500).json({ mensaje: 'Error al crear pedido' });
  }

  res.json({ mensaje: 'Pedido guardado correctamente' });
});

// Obtener pedidos de un usuario
router.get('/:email', async (req, res) => {
  const { email } = req.params;

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error al obtener pedidos:", error);
    return res.status(500).json({ mensaje: 'Error al obtener pedidos' });
  }

  res.json(data);
});

export default router;
