const Recordatorio = require('../models/recordatorio.model');

const RecordatorioService = {
  listar: async (idusuario) => {
    return await Recordatorio.listarPorUsuario(idusuario);
  },
  insertar: async (data) => {
    return await Recordatorio.insertar(data);
  },
  actualizar: async (data) => {
    return await Recordatorio.actualizar(data);
  },
  eliminar: async (idrecordatorio) => {
    return await Recordatorio.eliminar(idrecordatorio);
  },
  eliminarTodosPorUsuario: async (idusuario) => {
        return await Recordatorio.eliminarTodosPorUsuario(idusuario);
    }
};

module.exports = RecordatorioService;
