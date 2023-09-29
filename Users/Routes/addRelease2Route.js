const express = require('express')
const router = express.Router();
const { body } = require('express-validator');

const addRelease2Ctrl = require('../Controllers/addRelease2Controller')

router.post('/addRelease2', addRelease2Ctrl.addRelease2);
router.get('/getrelase2', addRelease2Ctrl.getRelease2);
router.get('/getUserSel/:id', addRelease2Ctrl.getRelease2sel);
router.get('/getUserProfile/:userId', addRelease2Ctrl.getUserData);

module.exports = router