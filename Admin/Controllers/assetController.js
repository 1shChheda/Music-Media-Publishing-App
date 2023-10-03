const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const path = require('path');
const { uploadFile } = require("../Middleware/fileUpload");
const AllModels = require("../../Utils/allModels");
const { createDirectories } = require('../Middleware/createDirectory');

exports.getAssets = async (req, res) => {
    try {
        // Fetch all assets from the model
        const assets = await AllModels.assetsModel.findAll();

        return res.status(200).json({ assets });
    } catch (error) {
        console.error('Error fetching assets:', error);
        return res.status(500).json({ message: 'Internal server error. Check console.' });
    }
};

exports.addAssets = async (req, res, next) => {
    try {
        if (req.files) {
            const artworkFile = req.files.artwork;
            const audioFile = req.files.audio;

            // Check if the uploaded artwork file is an image (PNG, JPEG, GIF)
            const allowedArtworkMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
            if (!allowedArtworkMimeTypes.includes(artworkFile.mimetype)) {
                return res.status(500).json({ error: 'Only image (PNG, JPEG, GIF) files are allowed for artwork.' });
            }

            // Check if the uploaded audio file is an mp3
            if (audioFile.mimetype !== 'audio/mpeg') {
                return res.status(500).json({ error: 'Only MP3 files are allowed for audio.' });
            }

            // Get the userId from the addRelease1 model based on addRelease1Id
            const addRelease1Id = req.body.addRelease1Id;
            const addRelease1 = await AllModels.addRelease1Model.findByPk(addRelease1Id);
            if (!addRelease1) {
                return res.status(404).json({ error: 'Add Release 1 not found.' });
            }
            const userId = addRelease1.userId;

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

                return res.status(200).json({ asset });
            } else {
                return res.status(500).json({ error: 'We encountered an error while uploading the files.' });
            }
        }

        return res.status(400).json({ error: 'No files were uploaded.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateAsset = async (req, res) => {
    try {
        const { assetId } = req.params;

        // Check if assetId is provided
        if (!assetId) {
            return res.status(400).json({ error: 'assetId is required.' });
        }

        // Find the asset by assetId
        const asset = await AllModels.assetsModel.findByPk(assetId);
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found.' });
        }

        // Update the fields
        const artworkFile = req.files.artwork
        const audioFile = req.files.audio
        // Get the userId from the addRelease1 model based on addRelease1Id
        const addRelease1Id = req.body.addRelease1Id;
        const addRelease1 = await AllModels.addRelease1Model.findByPk(addRelease1Id);
        if (!addRelease1) {
            return res.status(404).json({ error: 'Add Release 1 not found.' });
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

        return res.status(200).json({ asset });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.deleteAsset = async (req, res) => {
    try {
        const { assetId } = req.params;

        // Check if assetId is provided
        if (!assetId) {
            return res.status(400).json({ error: 'assetId is required.' });
        }

        // Find the asset by assetId
        const asset = await AllModels.assetsModel.findByPk(assetId);
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found.' });
        }

        // Delete the asset
        await asset.destroy();

        return res.status(200).json({ message: 'Asset deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
