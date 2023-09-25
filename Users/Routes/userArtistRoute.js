const express = require('express')
const router = express.Router();
const { body } = require('express-validator');

const userArtistCtrl = require('../Controllers/userArtistController')

router.post('/addUserArtist', userArtistCtrl.addUserArtist);

router.get('/search', userArtistCtrl.searchArtists)

router.get('/getArtist', userArtistCtrl.getAllArtist)


module.exports = router