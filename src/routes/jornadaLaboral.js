const express = require('express');
const router = express.Router();
const personal = require('../../controles/personal');

//get all personal
router.get('/api/jornada',personal.list);
router.post('/api/jornada/registrar',personal.insert);
router.put('/api/jornada/update/:id',personal.update);
router.delete('/api/jornada/delete/:id',personal.delete);

module.exports = router;