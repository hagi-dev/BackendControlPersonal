const express = require('express');
const router = express.Router();
const personal = require('../../controles/personal');

//get all personal
router.get('/api/sancion',personal.list);
router.post('/api/sancion/registrar',personal.insert);
router.put('/api/sancion/update/:id',personal.update);
router.delete('/api/sancion/delete/:id',personal.delete);

module.exports = router;