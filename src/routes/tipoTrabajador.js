const express = require('express');
const router = express.Router();
const tipoTrabajador = require('../../controles/tipoTrabajador');

//get all tipoTrabajador
router.get('/api/tipoTrabajador',tipoTrabajador.list);
router.get('/api/tipoTrabajador/lista/area',tipoTrabajador.listContratoArea);
router.get('/api/tipoTrabajador/lista/cargo',tipoTrabajador.listContratoCargo);
router.get('/api/tipoTrabajador/:id',tipoTrabajador.listId);
router.post('/api/tipoTrabajador/registrar',tipoTrabajador.insert);
router.put('/api/tipoTrabajador/update/:id',tipoTrabajador.update);
router.delete('/api/tipoTrabajador/delete/:id',tipoTrabajador.delete);

module.exports = router;