const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const AllModels = require("../../Utils/allModels");

exports.addRelease1 = async (req, res) => {
    const {
        songName,
        labelName,
        releaseDate,
        language,
        genreId,
        subgenreId,
        moodId,
        explicit,
        ytContentID,
        userId,
    } = req.body;

    try {
        // to check if a release with the same song name already exists
        const existingRelease = await AllModels.addRelease1Model.findOne({ where: { songName } });
        if (existingRelease) {
            return res.status(400).json({ message: 'A release with the same song name already exists.' });
        }

        // to create a new release with the provided fields
        const release = await AllModels.addRelease1Model.create({
            songName,
            labelName,
            releaseDate,
            language,
            genreId,
            subgenreId,
            moodId,
            explicit,
            ytContentID,
            userId,
        });

        return res.status(201).json({ message: 'Release added successfully.', release });
    } catch (error) {
        console.error('Error adding release:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
