const express = require('express');
const verifyToken = require('../middleware/verifyToken');

// Importamos los proxies
const authProxy = require('../proxies/auth.proxy');
const cursosProxy = require('../proxies/cursos.proxy');
const apuntesProxy = require('../proxies/apuntes.proxy');
const recordatoriosProxy = require('../proxies/recordatorios.proxy');

const router = express.Router();

// Middleware global de validación de token (antes de reenviar)
router.use(verifyToken);

// Montar proxies
authProxy(router);
cursosProxy(router);
apuntesProxy(router);
recordatoriosProxy(router);

module.exports = router;
