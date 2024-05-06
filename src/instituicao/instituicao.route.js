const express = require('express');
const router = express.Router();
const escolaController = require("./instituicao.controller");

router.post('/', escolaController.verificarEscola);
router.post('/cadastrar', escolaController.cadastrarInstituicao);

module.exports = router;
