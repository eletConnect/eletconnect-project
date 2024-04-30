const express = require('express');
const router = express.Router();
const authController = require("./auth.controller");

// Rota para login
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/confirm-registration', authController.confirmRegistration);

module.exports = router;
