const { pool } = require('../config/db');

const MateriaModel = {
    async listar() {
        const { rows } = await pool.query(`
            SELECT 
                idmateria AS "idMateria", 
                nombremateria AS "nombreMateria", 
                cursoparalelo AS "cursoParalelo", 
                nombredocente AS "nombreDocente", 
                horario, 
                estado,
                imagenurl AS "imagenUrl",
                clave
            FROM public.materia 
            WHERE estado = 'Activo'
            ORDER BY idmateria ASC
        `);
        return rows;
    },

    async buscarPorId(idmateria) {
        const { rows } = await pool.query(`
            SELECT 
                idmateria AS "idMateria", 
                nombremateria AS "nombreMateria", 
                cursoparalelo AS "cursoParalelo", 
                nombredocente AS "nombreDocente", 
                horario, 
                estado,
                imagenurl AS "imagenUrl",
                clave
            FROM public.materia 
            WHERE idmateria = $1 
            LIMIT 1
        `, [idmateria]);
        return rows[0] || null;
    }
};

module.exports = MateriaModel;