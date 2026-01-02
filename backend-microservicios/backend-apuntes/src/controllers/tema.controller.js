const TemaService = require('../services/tema.service');

const TemaController = {
    async listarPorApunte(req, res, next) {
        try {
            const { idapunte } = req.params;
            const data = await TemaService.listarPorApunte(idapunte);
            res.json(data);
        } catch (err) { next(err); }
    },

    async crear(req, res, next) {
        try {
            const { idApunte, idTemaPadre, nombre } = req.body;
            const idapunte = idApunte || req.body.idapunte;
            const idtemapadre = idTemaPadre || req.body.idtemapadre;

            const nuevo = await TemaService.crear({ idapunte, idtemapadre, nombre });
            res.status(201).json(nuevo);
        } catch (err) { next(err); }
    },

    async actualizar(req, res, next) {
        try {
            const { idtema } = req.params;
            const { nombre, idTemaPadre } = req.body;
            const idtemapadre = idTemaPadre || req.body.idtemapadre;

            const actualizado = await TemaService.actualizar({ idtema, nombre, idtemapadre });
            res.json(actualizado);
        } catch (err) { next(err); }
    },

    async eliminar(req, res, next) {
        try {
            const { idtema } = req.params;
            await TemaService.eliminar(idtema);
            res.json({ mensaje: 'Tema eliminado correctamente' });
        } catch (err) { next(err); }
    }
};

module.exports = TemaController;