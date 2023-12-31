const { validationResult } = require("express-validator");
const Sequelize = require('sequelize');
const AllModels = require("../../Utils/allModels");
const logger = require('../../Utils/logger')

exports.addUserArtist = async (req, res) => {
    const {
        firstName,
        lastName,
        spotifyURL,
        appleURL,
        instagramURL,
        youtubeURL,
        userId,
    } = req.body;

    try {
        //check whether the userID is banned or not
        const bannedUser = await AllModels.userModel.findByPk(userId)
        // console.log(bannedUser.active)
        if (bannedUser.active == false) {
            return res.status(400).json({ message: 'Your Account is banned try to contact Admin' });
        }

        // to create a new release with the provided fields
        const artist = await AllModels.userArtistModel.create({
            firstName,
            lastName,
            spotifyURL,
            appleURL,
            instagramURL,
            youtubeURL,
            userId
        });

        console.log(artist.id)
        const userArtistId = artist.id
        
        return res.status(201).json({ message: 'artist added successfully.', artist });
    } catch (error) {
        console.error('Error adding release:', error);
        return res.status(500).json({ message: 'Internal server error. check console' });
    }
};

exports.searchArtists = async (req, res) => {
    const { keyword } = req.query;

    try {
        const artists = await AllModels.userArtistModel.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { firstName: { [Sequelize.Op.like]: `%${keyword}%` } },
                    { lastName: { [Sequelize.Op.like]: `%${keyword}%` } },
                    // { spotifyURL: { [Sequelize.Op.like]: `%${keyword}%` } },
                    // { appleURL: { [Sequelize.Op.like]: `%${keyword}%` } },
                    // { instagramURL: { [Sequelize.Op.like]: `%${keyword}%` } },
                    // { youtubeURL: { [Sequelize.Op.like]: `%${keyword}%` } },
                ],
            },
        });

        return res.status(200).json(artists);
    } catch (error) {
        console.error('Error searching artists:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.getAllArtist = async (req, res) => {
    try {
        const artist = await AllModels.userArtistModel.findAll();
        const RESPONSE = { artist: artist };
        logger.writeLog(req, RESPONSE, "view", 'user')
        res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", 'user')
        return res.status(500).json(RESPONSE);
    }
}