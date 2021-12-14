const express = require('express');
const router = express.Router();
const contrato = require('../../controles/contrato');

//get all contrato
router.get('/api/contrato',contrato.list);
router.get('/api/contrato/:id',contrato.id);
router.get('/api/contrato/validate/fecha/:dni',contrato.validateDate);
router.get('/api/contratos',contrato.list3);
router.post('/api/contrato/registrar',contrato.insert);
router.put('/api/contrato/update/:id',contrato.update);
router.post('/api/contrato/delete/:id',contrato.delete);

module.exports = router;