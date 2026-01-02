const jwt = require('jsonwebtoken');
const RecordatorioService = require('../services/recordatorio.service');

function authMiddleware(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Token requerido' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido' });
    }
}

const RecordatorioController = {
    async listar(req, res, next) {
        try {
            const idusuario = req.user?.idUsuario;
            const data = await RecordatorioService.listar(idusuario);
            res.json(data);
        } catch (err) {
            next(err);
        }
    },

    async insertar(req, res, next) {
        try {
            const idusuario = req.user?.idUsuario;
            // CORRECCIÓN AQUÍ: Leemos 'fechaLimite' (CamelCase) del frontend
            const { titulo, descripcion, fechaLimite, hora } = req.body;
            
            const nuevo = await RecordatorioService.insertar({ 
                idusuario, 
                titulo, 
                descripcion, 
                fechalimite: fechaLimite,
                hora 
            });
            res.status(201).json(nuevo);
        } catch (err) {
            next(err);
        }
    },

    async actualizar(req, res, next) {
        try {
            const { idrecordatorio } = req.params;
            // CORRECCIÓN AQUÍ: También leemos 'fechaLimite' en CamelCase
            const { titulo, descripcion, fechaLimite, hora, estado } = req.body;
            
            const actualizado = await RecordatorioService.actualizar({
                idrecordatorio,
                titulo,
                descripcion,
                fechalimite: fechaLimite, // Mapeamos
                hora,
                estado
            });
            res.json(actualizado);
        } catch (err) {
            next(err);
        }
    },

    async eliminar(req, res, next) {
        try {
            const { idrecordatorio } = req.params;
            await RecordatorioService.eliminar(idrecordatorio);
            res.json({ mensaje: 'Recordatorio eliminado correctamente' });
        } catch (err) {
            next(err);
        }
    },

    async eliminarPorUsuario(req, res, next) {
        try {
            const { idusuario } = req.params;
            await RecordatorioService.eliminarTodosPorUsuario(idusuario);
            res.json({ mensaje: 'Todos los recordatorios del usuario eliminados' });
        } catch (err) {
            next(err);
        }
    },

    authMiddleware
};

module.exports = RecordatorioController;