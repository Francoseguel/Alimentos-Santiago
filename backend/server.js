import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import dishesRoutes from './routes/dishes.js';
import ordersRoutes from './routes/orders.js';
import path from 'path';
import { fileURLToPath } from 'url';


// Para poder usar __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/dishes', dishesRoutes);
app.use('/api/orders', ordersRoutes);

// Ruta para devolver index.html en /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
