const express = require('express');
const router = express.Router();
const personal = require('../../controles/personal');

//get all personal
router.get('/api/permiso',personal.list);
router.post('/api/permiso/registrar',personal.insert);
router.put('/api/permiso/update/:id',personal.update);
router.delete('/api/permiso/delete/:id',personal.delete);

module.exports = router;