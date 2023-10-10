const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const path = require('path');
const { uploadFile } = require("../Middleware/fileUpload");
const AllModels = require("../../Utils/allModels");
const { createDirectories } = require('../Middleware/createDirectory');
const logger = require("../../Utils/logger");

exports.getAssets = async (req, res) => {
    try {

        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        // Fetch all assets from the model
        const assets = await AllModels.assetsModel.findAll();

        const RESPONSE = { assets };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        res.status(500).json(RESPONSE);
    }
};

exports.addAssets = async (req, res, next) => {
    try {

        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        if (req.files) {
            const artworkFile = req.files.artwork;
            const audioFile = req.files.audio;

            // Check if the uploaded artwork file is an image (PNG, JPEG, GIF)
            const allowedArtworkMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
            if (!allowedArtworkMimeTypes.includes(artworkFile.mimetype)) {
                const RESPONSE = { error: 'Only image (PNG, JPEG, GIF) files are allowed for artwork.' };
                logger.writeLog(req, RESPONSE, "view", "admin");
                return res.status(500).json(RESPONSE);
            }

            // Check if the uploaded audio file is an mp3
            if (audioFile.mimetype !== 'audio/mpeg') {
                const RESPONSE = { error: 'Only MP3 files are allowed for audio.' };
                logger.writeLog(req, RESPONSE, "view", "admin");
                return res.status(500).json(RESPONSE);
            }

            // Get the userId from the addRelease1 model based on addRelease1Id
            const addRelease1Id = req.body.addRelease1Id;
            const addRelease1 = await AllModels.addRelease1Model.findByPk(addRelease1Id);
            if (!addRelease1) {
                const RESPONSE = { error: 'Add Release 1 not found.' };
                logger.writeLog(req, RESPONSE, "view", "admin");
                return res.status(404).json(RESPONSE);
            }
            const userId = addRelease1.userId;

            const existingRelease = await AllModels.assetsModel.findOne({ where: { addRelease1Id } });
            if (existingRelease) {
                const RESPONSE = { message: 'Artwork & Music File already exist for the Particular Release. Kindly Update the Assets if required' };
                logger.writeLog(req, RESPONSE, "view", "admin");
                return res.status(400).json(RESPONSE);
            }

            await createDirectories(`Upload/${userId}/addRelease1Id${addRelease1Id}/artwork`);
            await createDirectories(`Upload/${userId}/addRelease1Id${addRelease1Id}/music`);

            // Upload artwork and audio files
            const urlPort = req.get('host');
            const [isArtworkUploaded, artworkData] = await uploadFile(artworkFile, userId, `addRelease1Id${addRelease1Id}/artwork/`, urlPort);
            const [isAudioUploaded, audioData] = await uploadFile(audioFile, userId, `addRelease1Id${addRelease1Id}/music/`, urlPort);

            if (isArtworkUploaded && isAudioUploaded) {
                const asset = await AllModels.assetsModel.create({
                    artwork: '/Upload' + artworkData.url.substring(artworkData.url.indexOf('/Upload') + '/Upload'.length).replace(/\\/g, '/'),
                    audio: '/Upload' + audioData.url.substring(audioData.url.indexOf('/Upload') + '/Upload'.length).replace(/\\/g, '/'),
                    addRelease1Id: addRelease1Id,
                });

                const RESPONSE = { asset };
                logger.writeLog(req, RESPONSE, "view", "admin");
                return res.status(200).json(RESPONSE);
            } else {
                const RESPONSE = { error: 'We encountered an error while uploading the files.' };
                logger.writeLog(req, RESPONSE, "view", "admin");
                return res.status(500).json(RESPONSE);
            }
        }

        const RESPONSE = { error: 'No files were uploaded.' };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(400).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        res.status(500).json(RESPONSE);
    }
};

exports.updateAsset = async (req, res) => {
    try {
        const { assetId } = req.params;

        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        // Check if assetId is provided
        if (!assetId) {
            const RESPONSE = { error: 'assetId is required.' };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(400).json(RESPONSE);
        }

        // Find the asset by assetId
        const asset = await AllModels.assetsModel.findByPk(assetId);
        if (!asset) {
            const RESPONSE = { error: 'Asset not found.' };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        // Update the fields
        const artworkFile = req.files.artwork
        const audioFile = req.files.audio
        // Get the userId from the addRelease1 model based on addRelease1Id
        const addRelease1Id = req.body.addRelease1Id;
        const addRelease1 = await AllModels.addRelease1Model.findByPk(addRelease1Id);
        if (!addRelease1) {
            const RESPONSE = { error: 'Add Release 1 not found.' };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }
        const userId = addRelease1.userId;

        // Upload artwork and audio files
        const urlPort = req.get('host')
        console.log(req.get('host'))
        const [isArtworkUploaded, artworkData] = await uploadFile(artworkFile, userId, `addRelease1Id${addRelease1Id}/artwork/`, urlPort);
        const [isAudioUploaded, audioData] = await uploadFile(audioFile, userId, `addRelease1Id${addRelease1Id}/music/`, urlPort);
        asset.artwork = '/Upload' + artworkData.url.substring(artworkData.url.indexOf('/Upload') + '/Upload'.length).replace(/\\/g, '/') || asset.artwork;
        asset.audio = '/Upload' + audioData.url.substring(audioData.url.indexOf('/Upload') + '/Upload'.length).replace(/\\/g, '/') || asset.audio;
        asset.addRelease1Id = req.body.addRelease1Id || asset.addRelease1Id;

        // Save the updated asset
        await asset.save();

        const RESPONSE = { asset };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        res.status(500).json(RESPONSE);
    }
};

exports.deleteAsset = async (req, res) => {
    try {
        const { assetId } = req.params;

        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        // Check if assetId is provided
        if (!assetId) {
            const RESPONSE = { error: 'assetId is required.' };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(400).json(RESPONSE);
        }

        // Find the asset by assetId
        const asset = await AllModels.assetsModel.findByPk(assetId);
        if (!asset) {
            const RESPONSE = { error: 'Asset not found.' };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        // Delete the asset
        await asset.destroy();

        const RESPONSE = { message: 'Asset Deleted successfully!' };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        res.status(500).json(RESPONSE);
    }
};
