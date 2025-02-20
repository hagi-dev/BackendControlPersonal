const express = require('express');
const router = express.Router();
const contrato = require('../../controles/contrato');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//get all contrato
router.get('/api/contrato',contrato.list);
router.get('/api/contrato/:id',contrato.id);
router.get('/api/contrato/validate/fecha/:dni',contrato.validateDate);
router.get('/api/contratos',contrato.list3);
router.get('/api/contrato/horarios/:id',contrato.horarios);
router.post('/api/contrato/registrar', upload.single('file'),contrato.insert);
router.put('/api/contrato/update/:contratoId', upload.single('file'),contrato.update);
router.delete('/api/contrato/:id',contrato.delete);
router.get('/api/contrato/verificationPersonalAndContract/:dni',contrato.verificationPersonalAndContract);
router.get('/api/contrato/fullContract/:idContrato',contrato.fullContract);
router.get('/api/contrato/listContractFiles/:contratoId',contrato.listContractFiles);
router.delete('/api/contrato/file/:contratoArchivoId',contrato.deleteContractFile);

module.exports = router;