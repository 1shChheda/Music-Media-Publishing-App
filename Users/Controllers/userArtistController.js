const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const AllModels = require("../../Utils/allModels");

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
        // to check if a artist with the same song name already exists
        const existingArtist = await AllModels.userArtistModel.findOne({ where: {  } });
        if (existingRelease) {
            return res.status(400).json({ message: 'A release with the same song name already exists.' });
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

        return res.status(201).json({ message: 'artist added successfully.', artist });
    } catch (error) {
        console.error('Error adding release:', error);
        return res.status(500).json({ message: 'Internal server error. check console' });
    }
};