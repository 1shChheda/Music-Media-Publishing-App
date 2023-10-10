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

        if (artist) {
            await AllModels.primaryArtistModel.create({
                firstName,
                lastName,
                spotifyURL,
                appleURL,
                instagramURL,
                youtubeURL,
                userArtistId
            })
            await AllModels.featuringArtistModel.create({
                firstName,
                lastName,
                spotifyURL,
                appleURL,
                instagramURL,
                youtubeURL,
                userArtistId
            })
        }

        const RESPONSE = { message: 'artist added successfully.', artist };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(201).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
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

        const RESPONSE = artists
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};

exports.getAllArtist = async (req, res) => {
    try {
        const artist = await AllModels.userArtistModel.findAll();
        const RESPONSE = { artist: artist };
        logger.writeLog(req, RESPONSE, "view", 'admin')
        return res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", 'admin')
        return res.status(500).json(RESPONSE);
    }
}