const express = require('express');
const router = express.Router();
const personal = require('../../controles/personal');

//get all personal
router.get('/api/movimiento',personal.list);
router.post('/api/movimiento/registrar',personal.insert);
router.put('/api/movimiento/update/:id',personal.update);
router.delete('/api/movimiento/delete/:id',personal.delete);

module.exports = router;