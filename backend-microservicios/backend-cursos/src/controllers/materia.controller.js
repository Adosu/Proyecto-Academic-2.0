const MateriaService = require('../services/materia.service');

const MateriaController = {
  async listar(req, res, next) {
    try {
      const materias = await MateriaService.listar();
      res.json(materias);
    } catch (err) {
      next(err);
    }
  },

  async detalle(req, res, next) {
    try {
      const { idmateria } = req.params;
      const materia = await MateriaService.buscarPorId(idmateria);
      if (!materia) return res.status(404).json({ error: 'Materia no encontrada' });
      res.json(materia);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = MateriaController;
