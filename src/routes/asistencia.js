const express = require('express');
const router = express.Router();
const personal = require('../../controles/personal');

//get all personal
router.get('/api/asistencia',personal.list);

module.exports = router;