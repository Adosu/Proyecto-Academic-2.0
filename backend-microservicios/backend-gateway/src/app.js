const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('./config/dotenv');

const gatewayRoutes = require('./routes/gateway.routes');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use('/', gatewayRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada en Gateway' }));
module.exports = app;
