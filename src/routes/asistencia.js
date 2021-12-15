const express = require('express');
const router = express.Router();
const asistencia = require('../../controles/asistencia');

//get all asistencia
router.post('/api/asistencia',asistencia.list);

module.exports = router;