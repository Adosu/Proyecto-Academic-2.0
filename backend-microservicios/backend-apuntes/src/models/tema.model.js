const { pool } = require('../config/db');

const TemaModel = {
    async listarPorApunte(idapunte) {
        const { rows } = await pool.query(
            `SELECT 
                idtema AS "idTema", 
                idapunte AS "idApunte", 
                idtemapadre AS "idTemaPadre", 
                nombre
             FROM public.tema 
             WHERE idapunte = $1 
             ORDER BY idtema ASC`,
            [idapunte]
        );
        return rows;
    },

    async crear({ idapunte, idtemapadre, nombre }) {
        const { rows } = await pool.query(
            `INSERT INTO public.tema (idapunte, idtemapadre, nombre)
             VALUES ($1, $2, $3)
             RETURNING 
                idtema AS "idTema", 
                idapunte AS "idApunte", 
                idtemapadre AS "idTemaPadre", 
                nombre`,
            [idapunte, idtemapadre || null, nombre]
        );
        return rows[0];
    },

    async actualizar({ idtema, nombre, idtemapadre }) {
        const { rows } = await pool.query(
            `UPDATE public.tema
             SET nombre = $1, idtemapadre = $2
             WHERE idtema = $3
             RETURNING 
                idtema AS "idTema", 
                idapunte AS "idApunte", 
                idtemapadre AS "idTemaPadre", 
                nombre`,
            [nombre, idtemapadre || null, idtema]
        );
        return rows[0] || null;
    },

    async eliminar(idtema) {
        await pool.query('DELETE FROM public.tema WHERE idtema = $1', [idtema]);
        return true;
    }
};

module.exports = TemaModel;