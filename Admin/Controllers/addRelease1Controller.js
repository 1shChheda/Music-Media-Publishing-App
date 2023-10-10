const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const AllModels = require("../../Utils/allModels");
const logger = require("../../Utils/logger");

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
        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        // to check if a release with the same song name already exists
        const existingRelease = await AllModels.addRelease1Model.findOne({ where: { songName } });
        if (existingRelease) {
            const RESPONSE = { message: 'A release with the same song name already exists.' };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(400).json(RESPONSE);
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

        const RESPONSE = { message: 'Release added successfully!', release };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(201).json(RESPONSE);
    } catch (error) {
        console.error('Error adding release:', error);
        const RESPONSE = { message: 'Internal server error.' };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};

exports.getRelease1 = async (req, res) => {
    try {

        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        // to retrieve all releases from the database
        const releases = await AllModels.addRelease1Model.findAll({
            include: [
                { model: AllModels.genreModel, as: 'genre' },
                { model: AllModels.subGenreModel, as: 'subgenre' },
                { model: AllModels.moodModel, as: 'mood' },
            ]
        });

        const RESPONSE = { releases };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        console.error('Error retrieving releases:', error);
        const RESPONSE = { message: 'Internal server error.' };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
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

        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        // to check if the release with the provided id exists
        const release = await AllModels.addRelease1Model.findByPk(id);
        if (!release) {
            const RESPONSE = { message: 'Release not found.' };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
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

        const RESPONSE = { message: 'Release updated successfully!' };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        console.error('Error updating release:', error);
        const RESPONSE = { message: 'Internal server error.' };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};

exports.deleteRelease1 = async (req, res) => {
    const { id } = req.params;

    try {

        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        // to check if the release with the provided id exists
        const release = await AllModels.addRelease1Model.findByPk(id);
        if (!release) {
            const RESPONSE = { message: 'Release not found.' };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        // to delete the release
        await AllModels.addRelease1Model.destroy({ where: { id } });

        const RESPONSE = { message: 'Release deleted successfully.' };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        console.error('Error deleting release:', error);
        const RESPONSE = { message: 'Internal server error.' };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};