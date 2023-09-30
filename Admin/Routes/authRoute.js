const express = require('express')
const router = express.Router();
const { body } = require('express-validator');
const authCtrl = require('../Controllers/authController');

router.post("/login", authCtrl.adminLogin);

module.exports = router