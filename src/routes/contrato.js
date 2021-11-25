const express = require('express');
const router = express.Router();
const contrato = require('../../controles/contrato');

//get all contrato
router.get('/api/contrato',contrato.list);
router.post('/api/contrato/registrar',contrato.insert);
router.put('/api/contrato/update/:id',contrato.update);
router.delete('/api/contrato/delete/:id',contrato.delete);

module.exports = router;