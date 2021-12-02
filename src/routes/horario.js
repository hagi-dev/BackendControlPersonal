const express = require('express');
const router = express.Router();
const horario = require('../../controles/horario');

//get all horario
router.get('/api/horario',horario.list);
router.get('/api/horario/:id',horario.listId);
router.post('/api/horario/registrar',horario.insert);
router.put('/api/horario/update/:id',horario.update);
router.delete('/api/horario/delete/:id',horario.delete);

module.exports = router;