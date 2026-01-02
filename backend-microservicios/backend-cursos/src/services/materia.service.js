const Materia = require('../models/materia.model');

const MateriaService = {
  listar: async () => await Materia.listar(),
  buscarPorId: async (id) => await Materia.buscarPorId(id)
};

module.exports = MateriaService;
