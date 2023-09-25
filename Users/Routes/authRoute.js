const express = require('express')
const router = express.Router();
const { body } = require('express-validator');

const authCtrl = require('../Controllers/authController')

router.post('/signup',authCtrl.userSignup);

router.post('/login',authCtrl.userLogin);

module.exports = router