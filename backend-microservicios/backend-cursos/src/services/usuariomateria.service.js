const UsuarioMateria = require('../models/usuariomateria.model');
const Materia = require('../models/materia.model');

const UsuarioMateriaService = {
    listarPorUsuario: async (idusuario) => {
        return await UsuarioMateria.listarPorUsuario(idusuario);
    },
    inscribir: async ({ idusuario, idmateria, clave }) => {
        const materia = await Materia.buscarPorId(idmateria);
        if (!materia) {
            throw new Error('La materia no existe.');
        }
        if (materia.clave && materia.clave.trim() !== '') {
            if (materia.clave !== clave) {
                throw new Error('Clave de matriculación incorrecta.');
            }
        }
        const existe = await UsuarioMateria.buscarInscripcion(idusuario, idmateria);
        if (existe) {
            throw new Error('El usuario ya está inscrito en esta materia.');
        }
        return await UsuarioMateria.inscribir({ idusuario, idmateria });
    },
    desinscribir: async (idusumat) => {
        try {
            const urlApuntes = process.env.APUNTES_URL || 'http://localhost:3003';
            await fetch(`${urlApuntes}/usumat/${idusumat}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error(`Error al borrar apuntes para idUsuMat ${idusumat}:`, error.message);
        }
        return await UsuarioMateria.desinscribir(idusumat);
    },

    eliminarTodasPorUsuario: async (idusuario) => {
        const inscripciones = await UsuarioMateria.listarPorUsuario(idusuario);
        const urlApuntes = process.env.APUNTES_URL || 'http://localhost:3003';
        await Promise.all(inscripciones.map(async (inscripcion) => {
            try {
                await fetch(`${urlApuntes}/usumat/${inscripcion.idUsuMat}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                console.error(`Error cascada apuntes idUsuMat ${inscripcion.idUsuMat}:`, error.message);
            }
        }));
        return await UsuarioMateria.eliminarTodasPorUsuario(idusuario);
    }
};

module.exports = UsuarioMateriaService;