const express = require('express');
const router = express.Router();
const authController = require("./aluno.controller");

router.get('/', authController.listarAlunos);


module.exports = router;
