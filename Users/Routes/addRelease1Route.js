const express = require('express')
const router = express.Router();
const { body } = require('express-validator');

const addRelease1Ctrl = require('../Controllers/addRelease1Controller')

router.post('/addRelease1', addRelease1Ctrl.addRelease1);

module.exports = router