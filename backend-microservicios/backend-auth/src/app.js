const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Carga de variables
require('./config/dotenv');

const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Monta rutas directamente en '/'
app.use('/', authRoutes);

// Manejo de 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada en Auth Service' });
});

// Manejo de errores 500
app.use((err, req, res, next) => {
  console.error('Error en Auth:', err);
  res.status(500).json({ error: 'Error interno en Auth Service' });
});

module.exports = app;
