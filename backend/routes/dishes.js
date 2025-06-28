import express from 'express'
import { supabase } from '../supabaseClient.js'

const router = express.Router()

// ==============================
// Obtener todos los platos
// ==============================
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .order('nombre', { ascending: true })

  if (error) {
    console.error("Error al obtener platos:", error)
    return res.status(500).json({ mensaje: 'Error al obtener platos' })
  }

  res.json(data)
})



// ==============================
// Agregar un plato
// ==============================
router.post('/', async (req, res) => {
  const { nombre, descripcion, precio, disponible } = req.body

  const { error } = await supabase.from('dishes').insert([
    { nombre, descripcion, precio, disponible }
  ])

  if (error) {
    console.error("Error al agregar plato:", error)
    return res.status(500).json({ mensaje: 'Error al agregar plato' })
  }

  res.json({ mensaje: 'Plato agregado correctamente' })
})


// ==============================
// Editar un plato
// ==============================
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { nombre, descripcion, precio, disponible } = req.body

  const { error } = await supabase
    .from('dishes')
    .update({ nombre, descripcion, precio, disponible })
    .eq('id', id)

  if (error) {
    console.error("Error al editar plato:", error)
    return res.status(500).json({ mensaje: 'Error al editar plato' })
  }

  res.json({ mensaje: 'Plato editado correctamente' })
})


// ==============================
// Eliminar un plato
// ==============================
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from('dishes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error("Error al eliminar plato:", error)
    return res.status(500).json({ mensaje: 'Error al eliminar plato' })
  }

  res.json({ mensaje: 'Plato eliminado correctamente' })
})

export default router
