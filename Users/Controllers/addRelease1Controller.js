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
        // check whether the userID is banned or not
        const bannedUser = await AllModels.userModel.findByPk(userId)
        // console.log(bannedUser.active)
        if (bannedUser.active == false) {
            return res.status(400).json({ message: 'Your Account is banned try to contact Admin' });
        }

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

exports.getRelease1 = async (req, res) => {
    try {
        // to retrieve all releases from the database
        const releases = await AllModels.addRelease1Model.findAll({
            include: [
                { model: AllModels.genreModel, as: 'genre' },
                { model: AllModels.subGenreModel, as: 'subgenre' },
                { model: AllModels.moodModel, as: 'mood' },
            ]
        });

        return res.status(200).json({ releases });
    } catch (error) {
        console.error('Error retrieving releases:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.updateRelease1 = async (req, res) => {
    const { id } = req.params;
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
        // to check if the release with the provided id exists
        const release = await AllModels.addRelease1Model.findByPk(id);
        if (!release) {
            return res.status(404).json({ message: 'Release not found.' });
        }

        const addRelease1 = await AllModels.addRelease1Model.findOne({ where: { id: id } });

        if (!addRelease1) {
            return res.status(404).json({ message: 'AddRelease1 record not found for the provided addRelease1Id.' });
        }

        // Print the userID from AddRelease1 model to the console
        console.log('User ID from AddRelease1:', addRelease1.userId);

        // check whether the userID is banned or not
        const bannedUser = await AllModels.userModel.findByPk(addRelease1.userId)
        // console.log(bannedUser.active)
        if (bannedUser.active == false) {
            return res.status(400).json({ message: 'Your Account is banned try to contact Admin' });
        }

        // to update the release with the provided fields
        await AllModels.addRelease1Model.update(
            {
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
            },
            { where: { id } }
        );

        return res.status(200).json({ message: 'Release updated successfully.' });
    } catch (error) {
        console.error('Error updating release:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.deleteRelease1 = async (req, res) => {
    const { id } = req.params;

    try {
        // to check if the release with the provided id exists
        const release = await AllModels.addRelease1Model.findByPk(id);
        if (!release) {
            return res.status(404).json({ message: 'Release not found.' });
        }

        // to delete the release
        await AllModels.addRelease1Model.destroy({ where: { id } });

        return res.status(200).json({ message: 'Release deleted successfully.' });
    } catch (error) {
        console.error('Error deleting release:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};