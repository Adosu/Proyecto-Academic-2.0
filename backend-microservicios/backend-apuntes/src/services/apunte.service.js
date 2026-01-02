const Apunte = require('../models/apunte.model');
const Tema = require('../models/tema.model');
const Contenido = require('../models/contenido.model');

async function buildTree(idapunte) {
    const temas = await Tema.listarPorApunte(idapunte);
    const contenidosPorTema = new Map();

    // Pre-cargar contenidos por tema
    for (const t of temas) {
        const conts = await Contenido.listarPorTema(t.idTema);
        contenidosPorTema.set(t.idTema, conts);
    }

    // Índice por idtema
    const mapa = new Map();
    temas.forEach(t => mapa.set(t.idTema, { 
        ...t, 
        contenidos: contenidosPorTema.get(t.idTema) || [], 
        subtemas: [] 
    }));

    // Construcción del árbol
    const raiz = [];
    for (const t of mapa.values()) {
        if (t.idTemaPadre) {
            const padre = mapa.get(Number(t.idTemaPadre));
            if (padre) padre.subtemas.push(t);
            else raiz.push(t);
        } else {
            raiz.push(t);
        }
    }
    return raiz;
}

const ApunteService = {
    listarPorIdUsuMat: async (idusumat) => await Apunte.listarPorIdUsuMat(idusumat),
    crear: async (data) => await Apunte.crear(data),
    detalle: async (idapunte) => await Apunte.detalle(idapunte),
    actualizar: async (data) => await Apunte.actualizar(data),
    eliminar: async (idapunte) => await Apunte.eliminar(idapunte),
    arbol: async (idapunte) => await buildTree(idapunte),
    eliminarPorUsuMat: async (idusumat) => await Apunte.eliminarPorUsuMat(idusumat)
};

module.exports = ApunteService;