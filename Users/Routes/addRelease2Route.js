const express = require('express')
const router = express.Router();
const { body } = require('express-validator');

const addRelease2Ctrl = require('../Controllers/addRelease2Controller')

router.post('/addRelease2', addRelease2Ctrl.addRelease2);
router.get('/getrelase2', addRelease2Ctrl.getRelease2);
router.get('/getUserSel/:id', addRelease2Ctrl.getRelease2sel);
router.put('/updateAR2/:id', addRelease2Ctrl.updateRelease2);
router.delete('/deleteRelease/:id', addRelease2Ctrl.deleteRelease)

// to get user's data from both addRelease1 & 2
router.get('/getUserProfile/:userId', addRelease2Ctrl.getUserData);

module.exports = router