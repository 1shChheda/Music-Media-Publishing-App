const express = require('express')
const router = express.Router();
const { body } = require('express-validator');
const authCtrl = require('../Controllers/authController');

router.post("/login", authCtrl.loginController);
router.post('/adminSignUp', authCtrl.createAdmin); // use this route to initially add the superAdmin emails THAT'S IT! (then disable the route)

module.exports = router;