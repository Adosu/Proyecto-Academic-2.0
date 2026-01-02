const { pool } = require('../config/db');

const ApunteModel = {
    async listarPorIdUsuMat(idusumat) {
        const { rows } = await pool.query(
            `SELECT 
                idapunte AS "idApunte", 
                idusumat AS "idUsuMat", 
                fecha,
                titulo, 
                resumen
             FROM public.apunte 
             WHERE idusumat = $1 
             ORDER BY idapunte ASC`,
            [idusumat]
        );
        return rows;
    },

    async crear({ idusumat, titulo, resumen }) {
        const { rows } = await pool.query(
            `INSERT INTO public.apunte (idusumat, titulo, resumen)
             VALUES ($1, $2, $3)
             RETURNING 
                idapunte AS "idApunte", 
                idusumat AS "idUsuMat", 
                fecha,
                titulo, 
                resumen`,
            [idusumat, titulo, resumen || null]
        );
        return rows[0];
    },

    async detalle(idapunte) {
        const { rows } = await pool.query(
            `SELECT 
                idapunte AS "idApunte", 
                idusumat AS "idUsuMat", 
                fecha,
                titulo, 
                resumen
             FROM public.apunte 
             WHERE idapunte = $1 
             LIMIT 1`,
            [idapunte]
        );
        return rows[0] || null;
    },

    async actualizar({ idapunte, titulo, resumen }) {
        const { rows } = await pool.query(
            `UPDATE public.apunte
             SET titulo = $1, resumen = $2
             WHERE idapunte = $3
             RETURNING 
                idapunte AS "idApunte", 
                idusumat AS "idUsuMat", 
                fecha,
                titulo, 
                resumen`,
            [titulo, resumen || null, idapunte]
        );
        return rows[0] || null;
    },

    async eliminar(idapunte) {
        await pool.query('DELETE FROM public.apunte WHERE idapunte = $1', [idapunte]);
        return true;
    },

    async eliminarPorUsuMat(idusumat) {
        await pool.query('DELETE FROM public.apunte WHERE idusumat = $1', [idusumat]);
        return true;
    }
};

module.exports = ApunteModel;