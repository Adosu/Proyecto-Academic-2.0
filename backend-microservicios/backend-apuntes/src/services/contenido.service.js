const Contenido = require('../models/contenido.model');

const ContenidoService = {
    listarPorTema: async (idtema) => await Contenido.listarPorTema(idtema),
    crear: async (data) => await Contenido.crear(data),
    actualizar: async (data) => await Contenido.actualizar(data),
    eliminar: async (idcontenido) => await Contenido.eliminar(idcontenido)
};

module.exports = ContenidoService;