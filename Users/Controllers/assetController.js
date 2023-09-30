const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const path = require('path');
const { uploadFile } = require("../Middleware/fileUpload");
const AllModels = require("../../Utils/allModels");


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

            // Upload artwork and audio files
            const [isArtworkUploaded, artworkData] = await uploadFile(artworkFile, userId, 'artwork/', req.hostname);
            const [isAudioUploaded, audioData] = await uploadFile(audioFile, userId, 'music/', req.hostname);

            if (isArtworkUploaded && isAudioUploaded) {
                // Create a new asset with the provided fields
                const asset = await AllModels.assetsModel.create({
                    artwork: path.normalize(artworkData.url),
                    audio: path.normalize(audioData.url),
                    addRelease1Id: addRelease1Id,
                    // userId,
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
