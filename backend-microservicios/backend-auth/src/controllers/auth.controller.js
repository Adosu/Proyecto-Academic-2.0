const jwt = require('jsonwebtoken');
const UsuarioService = require('../services/usuario.service');

function emitirToken(user) {
  const payload = { idUsuario: user.idUsuario, correo: user.correo };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '8h'
  });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

const AuthController = {
  async register(req, res, next) {
    try {
      const { nombre, apellido, correo, contrasena } = req.body || {};
      if (!correo || !contrasena) {
        return res.status(400).json({ error: 'correo y contrasena son obligatorios' });
      }
      
      const user = await UsuarioService.registrar({ nombre, apellido, correo, contrasena });
      const token = emitirToken(user);
      
      // En registro SI devolvemos user y token envueltos (estándar)
      res.status(201).json({ user, token });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { correo, contrasena } = req.body || {};
      if (!correo || !contrasena) {
        return res.status(400).json({ error: 'correo y contrasena son obligatorios' });
      }

      const user = await UsuarioService.validarCredenciales({ correo, contrasena });
      if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

      const perfil = await UsuarioService.perfil(user.idUsuario);
      const token = emitirToken(user);
      
      // En login SI devolvemos user y token envueltos
      res.json({ user: perfil, token });
    } catch (err) {
      next(err);
    }
  },

  async me(req, res, next) {
    try {
      const id = req.user?.idUsuario || req.user?.idusuario;
      const perfil = await UsuarioService.perfil(id);
      
      // CORRECCIÓN CRÍTICA: Devolvemos 'perfil' directamente
      // Antes: res.json({ user: perfil }); -> Angular no lo leía
      res.json(perfil); 
    } catch (err) {
      next(err);
    }
  },

  async actualizar(req, res, next) {
    try {
      const idusuario = req.user?.idUsuario || req.user?.idusuario;
      const { nombre, apellido, correo, contrasena } = req.body;
      
      const actualizado = await UsuarioService.actualizar({
        idusuario, 
        nombre, 
        apellido, 
        correo, 
        contrasenaHash: contrasena 
      });

      if (!actualizado) {
         return res.status(404).json({ error: 'Usuario no encontrado o no se pudo actualizar' });
      }

      // CORRECCIÓN CRÍTICA: Devolvemos el objeto actualizado directamente
      res.json(actualizado);
    } catch (err) {
      next(err);
    }
  },

  async eliminar(req, res, next) {
    try {
      const idusuario = req.user?.idUsuario || req.user?.idusuario;
      await UsuarioService.eliminar(idusuario);
      res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  },

  authMiddleware
};

module.exports = AuthController;