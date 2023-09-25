const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const AllModels = require("../../Utils/allModels");

exports.addRelease2 = async (req, res) => {
    const {
        lyricist,
        composer,
        primaryArtist,
        featuringArtist,
        addRelease1Id
    } = req.body;

    try {

        // to create a new release with the provided fields
        const release = await AllModels.addRelease2Model.create({
            lyricist,
            composer,
            primaryArtist,
            featuringArtist,
            addRelease1Id
        });


        return res.status(201).json({ message: 'Release 2 added successfully.', release });
    } catch (error) {
        console.error('Error adding release:', error);
        return res.status(500).json({ message: 'Internal server error. check console' });
    }
};

exports.getRelease2 = async (req, res) => {
    try {
        // to retrieve all Release2 records with the specified fields
        const releases = await AllModels.addRelease2Model.findAll();

        // Convert primaryArtist and featuringArtist to arrays
        //   if (releases) {
        //     releases.forEach((release) => {
        //       if (release.primaryArtist) {
        //         release.primaryArtist = JSON.parse(release.primaryArtist);
        //       }
        //       if (release.featuringArtist) {
        //         release.featuringArtist = JSON.parse(release.featuringArtist);
        //       }
        //     });
        //   }
        if (releases) {
            releases.forEach((release) => {
                if (release.primaryArtist) {
                    release.primaryArtist = JSON.parse(release.primaryArtist).map(Number);
                }
                if (release.featuringArtist) {
                    release.featuringArtist = JSON.parse(release.featuringArtist).map(Number);
                }
            });
        }


        return res.status(200).json(releases);
    } catch (error) {
        console.error('Error retrieving Release2:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};