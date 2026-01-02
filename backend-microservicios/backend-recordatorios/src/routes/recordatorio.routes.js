const { Router } = require('express');
const RecordatorioController = require('../controllers/recordatorio.controller');

const router = Router();

router.get('/', RecordatorioController.authMiddleware, RecordatorioController.listar);
router.post('/', RecordatorioController.authMiddleware, RecordatorioController.insertar);
router.put('/:idrecordatorio', RecordatorioController.authMiddleware, RecordatorioController.actualizar);
router.delete('/:idrecordatorio', RecordatorioController.authMiddleware, RecordatorioController.eliminar);
router.delete('/usuario/:idusuario', RecordatorioController.eliminarPorUsuario);

module.exports = router;
