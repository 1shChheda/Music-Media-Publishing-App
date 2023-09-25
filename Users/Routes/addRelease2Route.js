const express = require('express')
const router = express.Router();
const { body } = require('express-validator');

const addRelease2Ctrl = require('../Controllers/addRelease2Controller')

router.post('/addRelease2', addRelease2Ctrl.addRelease2);

router.get('/getrelase2', addRelease2Ctrl.getRelease2);

module.exports = router