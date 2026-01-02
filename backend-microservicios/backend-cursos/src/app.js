const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('./config/dotenv');

const cursosRoutes = require('./routes/cursos.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/', cursosRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada en Cursos Service' }));

app.use((err, req, res, next) => {
  console.error('Error en Cursos:', err);
  res.status(500).json({ error: 'Error interno en Cursos Service' });
});

module.exports = app;
