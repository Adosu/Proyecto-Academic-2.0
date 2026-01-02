const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');

const UsuarioService = {
  async registrar({ nombre, apellido, correo, contrasena }) {
    const existente = await Usuario.findByCorreo(correo);
    if (existente) {
      const error = new Error('El correo ya está registrado');
      error.status = 409;
      throw error;
    }
    const contrasenaHash = await bcrypt.hash(contrasena, 10);
    return await Usuario.create({ nombre, apellido, correo, contrasenaHash });
  },

  async validarCredenciales({ correo, contrasena }) {
    const user = await Usuario.findByCorreo(correo);
    if (!user) return null;
    const ok = await bcrypt.compare(contrasena, user.contrasena);
    if (!ok) return null;
    return user;
  },

  async perfil(idusuario) {
    return await Usuario.findById(idusuario);
  },

  async actualizar({ idusuario, nombre, apellido, correo, contrasenaHash }) {
    if (contrasenaHash) {
      contrasenaHash = await bcrypt.hash(contrasenaHash, 10);
    }
    return await Usuario.update({ idusuario, nombre, apellido, correo, contrasenaHash });
  },

  async eliminar(idusuario) {
    // 1. Eliminar Recordatorios (Si falla, solo mostramos error en consola y seguimos)
    try {
      const urlRecordatorios = process.env.RECORDATORIOS_URL || 'http://localhost:3004';
      await fetch(`${urlRecordatorios}/usuario/${idusuario}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error al limpiar recordatorios:', error.message);
    }

    // 2. Eliminar Inscripciones de Cursos
    try {
      const urlCursos = process.env.CURSOS_URL || 'http://localhost:3002';
      await fetch(`${urlCursos}/usuario/${idusuario}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error al limpiar cursos:', error.message);
    }

    // 3. Finalmente, eliminar el usuario de la BD de Auth
    return await Usuario.delete(idusuario);
  }
};

module.exports = UsuarioService;