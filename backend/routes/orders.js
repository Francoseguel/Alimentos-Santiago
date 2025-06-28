import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// =====================================
// Crear un nuevo pedido
// =====================================
router.post('/', async (req, res) => {
  const { user_email, platos, tipoEntrega, fechaHora } = req.body;

  if (!user_email || !platos || !Array.isArray(platos) || platos.length === 0 || !fechaHora || !tipoEntrega) {
    return res.status(400).json({ mensaje: 'Datos incompletos' });
  }

  // Insertar pedido
  const { error } = await supabase.from('orders').insert([{
    user_email,
    platos,
    tipoEntrega,
    fechaHora
  }]);

  if (error) {
    console.error('❌ Error al crear pedido:', error);
    return res.status(500).json({ mensaje: 'Error al crear pedido' });
  }

  res.json({ mensaje: '✅ Pedido creado correctamente' });
});

// =====================================
// Obtener pedidos de un usuario
// =====================================
router.get('/:user_email', async (req, res) => {
  const { user_email } = req.params;

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_email', user_email)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error al obtener pedidos:', error);
    return res.status(500).json({ mensaje: 'Error al obtener pedidos' });
  }

  res.json(data);
});

export default router;
