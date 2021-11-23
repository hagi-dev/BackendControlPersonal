const express = require('express');
const router = express.Router();
const personal = require('../../controles/personal');

//get all personal
router.get('/api/contrato',personal.list);
router.post('/api/contrato/registrar',personal.insert);
router.put('/api/contrato/update/:id',personal.update);
router.delete('/api/contrato/delete/:id',personal.delete);

module.exports = router;