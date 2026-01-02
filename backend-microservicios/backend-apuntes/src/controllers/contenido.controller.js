const ContenidoService = require('../services/contenido.service');

const ContenidoController = {
    async listarPorTema(req, res, next) {
        try {
            const { idtema } = req.params;
            const data = await ContenidoService.listarPorTema(idtema);
            res.json(data);
        } catch (err) { next(err); }
    },

    async crear(req, res, next) {
        try {
            const { idTema, texto } = req.body;
            const idtema = idTema || req.body.idtema;
            const nuevo = await ContenidoService.crear({ idtema, texto });
            res.status(201).json(nuevo);
        } catch (err) { next(err); }
    },

    async actualizar(req, res, next) {
        try {
            const { idcontenido } = req.params;
            const { texto } = req.body;
            const actualizado = await ContenidoService.actualizar({ idcontenido, texto });
            res.json(actualizado);
        } catch (err) { next(err); }
    },

    async eliminar(req, res, next) {
        try {
            const { idcontenido } = req.params;
            await ContenidoService.eliminar(idcontenido);
            res.json({ mensaje: 'Contenido eliminado correctamente' });
        } catch (err) { next(err); }
    }
};

module.exports = ContenidoController;