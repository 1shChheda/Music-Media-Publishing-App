const express = require('express')
const router = express.Router();
const { body } = require('express-validator');
const statusCtrl = require('../Controllers/statusController')


router.post('/updateStatus/:addrelease1Id', statusCtrl.statusUpdater)

module.exports = router