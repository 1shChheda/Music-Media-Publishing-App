const express = require('express')
const router = express.Router();
const { body } = require('express-validator');

const assetCtrl = require('../Controllers/assetController')

router.get('/getAsset', assetCtrl.getAssets);
router.post('/addAssets', assetCtrl.addAssets);
router.put('/updateAsset/:assetId', assetCtrl.updateAsset);
router.delete('/deleteAsset/:assetId', assetCtrl.deleteAsset);

module.exports = router