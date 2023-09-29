const express = require('express')
const router = express.Router();
const { body } = require('express-validator');

const addRelease1Ctrl = require('../Controllers/addRelease1Controller')

router.post('/addRelease1', addRelease1Ctrl.addRelease1);
router.get('/getRelases',addRelease1Ctrl.getRelease1);
router.put('/updateRelease1/:id',addRelease1Ctrl.updateRelease1);
router.delete('/deleteRelease1/:id',addRelease1Ctrl.deleteRelease1);

module.exports = router