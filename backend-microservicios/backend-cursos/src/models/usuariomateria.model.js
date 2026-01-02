const { pool } = require('../config/db');

const UsuarioMateriaModel = {
    async listarPorUsuario(idusuario) {
        const { rows } = await pool.query(`
            SELECT 
                um.idusumat AS "idUsuMat",
                m.idmateria AS "idMateria", 
                m.nombremateria AS "nombreMateria", 
                m.cursoparalelo AS "cursoParalelo", 
                m.nombredocente AS "nombreDocente", 
                m.imagenurl AS "imagenUrl"
            FROM public.usuariomateria um
            INNER JOIN public.materia m ON um.idmateria = m.idmateria
            WHERE um.idusuario = $1 AND um.estado = 'Activo'
            ORDER BY um.idusumat
        `, [idusuario]);
        return rows;
    },

    async inscribir({ idusuario, idmateria }) {
        const { rows } = await pool.query(`
            INSERT INTO public.usuariomateria (idusuario, idmateria)
            VALUES ($1, $2)
            RETURNING 
                idusumat AS "idUsuMat", 
                idusuario AS "idUsuario", 
                idmateria AS "idMateria", 
                estado,
                fecharegistro AS "fechaRegistro"
        `, [idusuario, idmateria]);
        return rows[0];
    },

    async buscarInscripcion(idusuario, idmateria) {
        const { rows } = await pool.query(`
            SELECT idusumat AS "idUsuMat"
            FROM public.usuariomateria
            WHERE idusuario = $1 AND idmateria = $2
        `, [idusuario, idmateria]);
        return rows[0] || null;
    },

    async desinscribir(idusumat) {
        await pool.query('DELETE FROM public.usuariomateria WHERE idusumat = $1', [idusumat]);
        return true;
    },

    // NUEVO: Para eliminación en cascada desde Auth
    async eliminarTodasPorUsuario(idusuario) {
        await pool.query('DELETE FROM public.usuariomateria WHERE idusuario = $1', [idusuario]);
        return true;
    }
};

module.exports = UsuarioMateriaModel;