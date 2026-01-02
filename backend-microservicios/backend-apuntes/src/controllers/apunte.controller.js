const ApunteService = require('../services/apunte.service');

const ApunteController = {
    async listarPorUsuMat(req, res, next) {
        try {
            const { idusumat } = req.params;
            const data = await ApunteService.listarPorIdUsuMat(idusumat);
            res.json(data);
        } catch (err) { next(err); }
    },

    async crear(req, res, next) {
        try {
            const { idusumat, titulo, resumen } = req.body;
            const nuevo = await ApunteService.crear({ idusumat, titulo, resumen });
            res.status(201).json(nuevo);
        } catch (err) { next(err); }
    },

    async detalle(req, res, next) {
        try {
            const { idapunte } = req.params;
            const data = await ApunteService.detalle(idapunte);
            if (!data) return res.status(404).json({ error: 'Apunte no encontrado' });
            res.json(data);
        } catch (err) { next(err); }
    },

    async actualizar(req, res, next) {
        try {
            const { idapunte } = req.params;
            const { titulo, resumen } = req.body;
            const actualizado = await ApunteService.actualizar({ idapunte, titulo, resumen });
            res.json(actualizado);
        } catch (err) { next(err); }
    },

    async eliminar(req, res, next) {
        try {
            const { idapunte } = req.params;
            await ApunteService.eliminar(idapunte);
            res.json({ mensaje: 'Apunte eliminado correctamente' });
        } catch (err) { next(err); }
    },

    async arbol(req, res, next) {
        try {
            const { idapunte } = req.params;
            const tree = await ApunteService.arbol(idapunte);
            res.json(tree);
        } catch (err) { next(err); }
    },

    async eliminarPorUsuMat(req, res, next) {
        try {
            const { idusumat } = req.params;
            await ApunteService.eliminarPorUsuMat(idusumat);
            res.json({ mensaje: `Apuntes de la inscripción ${idusumat} eliminados` });
        } catch (err) { next(err); }
    }
};

module.exports = ApunteController;