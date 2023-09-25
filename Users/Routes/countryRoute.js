const express = require('express')
const router = express.Router();
const { body } = require('express-validator');

const countryCtrl = require('../Controllers/countryController')

router.get('/getCountry',countryCtrl.getCountries);

router.post('/addCountry',countryCtrl.postCountry);

router.put('/updateCountry/:id',countryCtrl.updateCountry);

router.delete('/delCountry/:id',countryCtrl.deleteCountry);

module.exports = router;