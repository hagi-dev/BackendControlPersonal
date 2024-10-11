const express = require('express');
const router = express.Router();
const personal = require('../../controles/personal');

//get all personal
router.get('/api/personal',personal.list);
router.post('/api/personal/ids',personal.id);
router.get('/api/personal/id/:id',personal.listId);
router.post('/api/personal/registrar',personal.insert);
router.put('/api/personal/update/:id',personal.update);
router.delete('/api/personal/delete/:id',personal.delete);
router.put('/api/personal/update-password/:dni',personal.updatePassword);

module.exports = router;