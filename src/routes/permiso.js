const express = require('express');
const router = express.Router();
const permiso = require('../../controles/permiso');

//get all permiso
router.get('/api/permiso',permiso.list);
router.post('/api/permiso/registrar',permiso.insert);
router.put('/api/permiso/update/:id',permiso.update);
router.delete('/api/permiso/delete/:id',permiso.delete);

module.exports = router;