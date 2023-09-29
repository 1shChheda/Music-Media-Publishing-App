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
        // to check the length of primaryArtist and featuringArtist arrays
        const primaryArtistArray = primaryArtist.split('", "').map(item => item.replace(/"/g, ''));
        const featuringArtistArray = featuringArtist.split('", "').map(item => item.replace(/"/g, ''));
        console.log(primaryArtistArray.length)
        console.log(primaryArtistArray)

        if (primaryArtistArray.length > 3 || featuringArtistArray.length > 10) {
            return res.status(400).json({ message: 'Invalid input. primaryArtist should have at most 3 elements and featuringArtist should have at most 10 elements.' });
        }

        // to create a new release with the provided fields
        const release = await AllModels.addRelease2Model.create({
            lyricist,
            composer,
            primaryArtist,
            featuringArtist,
            addRelease1Id
        });

        // to convert the primaryArtist and featuringArtist arrays to JSON objects
        const primaryArtistJson = release.primaryArtist.map(str => parseInt(str.replace(/"/g, "")));
        const featuringArtistJson = release.featuringArtist.map(str => parseInt(str.replace(/"/g, "")));

        // to update the release object with the JSON objects
        release.primaryArtist = primaryArtistJson;
        release.featuringArtist = featuringArtistJson;

        // finding the length
        const primaryArtistLength = release.primaryArtist.length;
        const featuringArtistLength = release.featuringArtist.length;
        console.log("the length of primaryArtist is: " + primaryArtistLength);
        console.log("the length of featuringArtist is: " + featuringArtistLength);

        // to save the release object to the database
        await release.save();

        return res.status(201).json({ message: 'Release 2 added successfully.', release });
    } catch (error) {
        console.error('Error adding release:', error);
        return res.status(500).json({ message: 'Internal server error. Check console.' });
    }
};

exports.getRelease2 = async (req, res) => {
    try {
        // to retrieve all Release2 records with the specified fields
        const releases = await AllModels.addRelease2Model.findAll();
        if (releases) {
            const primaryArtistIds = [];
            const featuringArtistIds = [];

            releases.forEach((release) => {
                // if (release.primaryArtist) {
                //   release.primaryArtist = release.primaryArtist.map(str => parseInt(str.replace(/"/g, "")));
                //   primaryArtistIds.push(...release.primaryArtist);
                // }
                // if (release.featuringArtist) {
                //   release.featuringArtist = release.featuringArtist.map(str => parseInt(str.replace(/"/g, "")));
                //   featuringArtistIds.push(...release.featuringArtist);
                // }
            });

            console.log("primaryArtistID are: " + primaryArtistIds.join(', '));
            console.log(primaryArtistIds.length);
            console.log("featuringArtistID are: " + featuringArtistIds.join(', '));
            console.log(featuringArtistIds.length);

            for (const release of releases) {
                if (release.primaryArtist) {
                    release.primaryArtist = release.primaryArtist.map(str => parseInt(str.replace(/"/g, "")));
                    primaryArtistIds.push(...release.primaryArtist);
                }
                const primaryArtistNames = await AllModels.userArtistModel.findAll({
                    where: { id: { [Op.in]: primaryArtistIds } },
                    attributes: ['id', 'firstName', 'lastName']
                });
                console.log('Primary Artist Names:');
                console.log(primaryArtistNames.map(artist => artist.get({ plain: true })));

                release.primaryArtist = primaryArtistNames.map(artist => artist.firstName + " " + artist.lastName);
                primaryArtistIds.length = 0
            }

            for (const release of releases) {
                if (release.featuringArtist) {
                    release.featuringArtist = release.featuringArtist.map(str => parseInt(str.replace(/"/g, "")));
                    featuringArtistIds.push(...release.featuringArtist);
                }
                const featuringArtistNames = await AllModels.userArtistModel.findAll({
                    where: { id: { [Op.in]: featuringArtistIds } },
                    attributes: ['id', 'firstName', 'lastName']
                });
                console.log('Featuring Artist Names:');
                console.log(featuringArtistNames.map(artist => artist.get({ plain: true })));
                release.featuringArtist = featuringArtistNames.map(feat => feat.firstName + " " + feat.lastName)
                featuringArtistIds.length = 0
            }
        }

        return res.status(200).json(releases);
    } catch (error) {
        console.error('Error retrieving Release2:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};