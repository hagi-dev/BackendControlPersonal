const express = require('express');
const router = express.Router();
const login2 = require('../../controles/login');

//get all asistencia
router.post('/api/recovery-password',login2.recovery);

module.exports = router;