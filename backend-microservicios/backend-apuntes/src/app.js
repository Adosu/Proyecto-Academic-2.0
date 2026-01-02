const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('./config/dotenv');

const apuntesRoutes = require('./routes/apuntes.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/', apuntesRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada en Apuntes Service' }));
app.use((err, req, res, next) => {
  console.error('Error en Apuntes:', err);
  res.status(500).json({ error: 'Error interno en Apuntes Service' });
});

module.exports = app;
