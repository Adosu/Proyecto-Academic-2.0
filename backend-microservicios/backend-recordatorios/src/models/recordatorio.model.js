const { pool } = require('../config/db');

const RecordatorioModel = {
    async listarPorUsuario(idusuario) {
        const { rows } = await pool.query(
            `SELECT 
                idrecordatorio AS "idRecordatorio", 
                idusuario AS "idUsuario", 
                titulo, 
                descripcion, 
                fechalimite AS "fechaLimite", 
                hora, 
                estado, 
                fecharegistro AS "fechaRegistro"
             FROM public.recordatorio 
             WHERE idusuario = $1 
             ORDER BY fechalimite ASC`,
            [idusuario]
        );
        return rows;
    },

    async insertar({ idusuario, titulo, descripcion, fechalimite, hora, estado }) {
        const { rows } = await pool.query(
            `INSERT INTO public.recordatorio (idusuario, titulo, descripcion, fechalimite, hora, estado)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING 
                idrecordatorio AS "idRecordatorio", 
                idusuario AS "idUsuario", 
                titulo, 
                descripcion, 
                fechalimite AS "fechaLimite", 
                hora, 
                estado, 
                fecharegistro AS "fechaRegistro"`,
            // CORRECCIÓN: Si estado es null/undefined, insertamos 'Activo' por defecto
            [idusuario, titulo, descripcion, fechalimite, hora, estado || 'Activo']
        );
        return rows[0];
    },

    async actualizar({ idrecordatorio, titulo, descripcion, fechalimite, hora, estado }) {
        const { rows } = await pool.query(
            `UPDATE public.recordatorio
             SET titulo = $1, 
                 descripcion = $2, 
                 fechalimite = $3, 
                 hora = $4, 
                 -- CORRECCIÓN: Si el estado llega null ($5), mantenemos el valor actual de la columna (estado)
                 estado = COALESCE($5, estado) 
             WHERE idrecordatorio = $6
             RETURNING 
                idrecordatorio AS "idRecordatorio", 
                idusuario AS "idUsuario", 
                titulo, 
                descripcion, 
                fechalimite AS "fechaLimite", 
                hora, 
                estado, 
                fecharegistro AS "fechaRegistro"`,
            [titulo, descripcion, fechalimite, hora, estado, idrecordatorio]
        );
        return rows[0] || null;
    },

    async eliminar(idrecordatorio) {
        await pool.query('DELETE FROM public.recordatorio WHERE idrecordatorio = $1', [idrecordatorio]);
        return true;
    },

    async eliminarTodosPorUsuario(idusuario) {
        await pool.query('DELETE FROM public.recordatorio WHERE idusuario = $1', [idusuario]);
        return true;
    }
};

module.exports = RecordatorioModel;