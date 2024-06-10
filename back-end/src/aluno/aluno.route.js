const express = require('express');
const router = express.Router();
const authController = require("./aluno.controller");

router.post('/listar', authController.listarAlunos);

module.exports = router;
