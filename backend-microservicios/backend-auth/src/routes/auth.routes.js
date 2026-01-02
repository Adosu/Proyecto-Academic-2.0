const { Router } = require('express');
const AuthController = require('../controllers/auth.controller');

const router = Router();

// Rutas públicas
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Ver perfil
router.get('/me', AuthController.authMiddleware, AuthController.me);

// Actualizar perfil
router.put('/update', AuthController.authMiddleware, AuthController.actualizar);

// Eliminar cuenta
router.delete('/delete', AuthController.authMiddleware, AuthController.eliminar);

module.exports = router;
