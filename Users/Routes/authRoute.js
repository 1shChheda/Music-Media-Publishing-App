const express = require('express')
const router = express.Router();
const { body } = require('express-validator');

const tokenVerify = require("../Middleware/tokenVerify");
const authCtrl = require('../Controllers/authController')

router.post("/signup", tokenVerify, authCtrl.userSignup);

router.post("/login", tokenVerify, authCtrl.userLogin);

module.exports = router