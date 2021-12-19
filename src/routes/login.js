const express = require('express');
const router = express.Router();
const login2 = require('../../controles/login');

//get all asistencia
router.post('/api/login',login2.login);

module.exports = router;