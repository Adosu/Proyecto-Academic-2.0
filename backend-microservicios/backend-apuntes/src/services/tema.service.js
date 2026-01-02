const Tema = require('../models/tema.model');

const TemaService = {
    listarPorApunte: async (idapunte) => await Tema.listarPorApunte(idapunte),
    crear: async (data) => await Tema.crear(data),
    actualizar: async (data) => await Tema.actualizar(data),
    eliminar: async (idtema) => await Tema.eliminar(idtema)
};

module.exports = TemaService;