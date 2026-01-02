const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('./config/dotenv');

const recordatorioRoutes = require('./routes/recordatorio.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/', recordatorioRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada en Recordatorios Service' }));

app.use((err, req, res, next) => {
  console.error('Error en Recordatorios:', err);
  res.status(500).json({ error: 'Error interno en Recordatorios Service' });
});

module.exports = app;
