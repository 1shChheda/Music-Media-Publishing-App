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

// for all AddRelease2 records
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

// for a specific AddRelease2 record
exports.getRelease2sel = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if ID is provided
        if (!id) {
            logger.writeLog(req, { message: 'ID is required.' }, 'view', 'user')
            return res.status(400).json({ message: 'ID is required.' });
        }

        // to retrieve Release2 records with the specified ID
        const releases = await AllModels.addRelease2Model.findAll({
            where: { id },
        });

        if (releases.length === 0) {
            logger.writeLog(req, { message: 'No records found for the provided ID.' }, 'view', 'user')
            return res.status(404).json({ message: 'No records found for the provided ID.' });
        }

        const primaryArtistIds = [];
        const featuringArtistIds = [];

        releases.forEach((release) => {
            if (release.primaryArtist) {
                release.primaryArtist = release.primaryArtist.map(str => parseInt(str.replace(/"/g, "")));
                primaryArtistIds.push(...release.primaryArtist);
            }
            if (release.featuringArtist) {
                release.featuringArtist = release.featuringArtist.map(str => parseInt(str.replace(/"/g, "")));
                featuringArtistIds.push(...release.featuringArtist);
            }
        });

        console.log("primaryArtistID are: " + primaryArtistIds.join(', '));
        console.log(primaryArtistIds.length);
        console.log("featuringArtistID are: " + featuringArtistIds.join(', '));
        console.log(featuringArtistIds.length);

        for (const release of releases) {
            const primaryArtistNames = await AllModels.userArtistModel.findAll({
                where: { id: { [Op.in]: primaryArtistIds } },
                attributes: ['id', 'firstName', 'lastName']
            });
            console.log('Primary Artist Names:');
            console.log(primaryArtistNames.map(artist => artist.get({ plain: true })));

            release.primaryArtist = primaryArtistNames.map(artist => artist.firstName + " " + artist.lastName);
        }

        for (const release of releases) {
            const featuringArtistNames = await AllModels.userArtistModel.findAll({
                where: { id: { [Op.in]: featuringArtistIds } },
                attributes: ['id', 'firstName', 'lastName']
            });
            console.log('Featuring Artist Names:');
            console.log(featuringArtistNames.map(artist => artist.get({ plain: true })));
            release.featuringArtist = featuringArtistNames.map(feat => feat.firstName + " " + feat.lastName)
        }

        logger.writeLog(req, { message: releases }, 'view', 'user')

        return res.status(200).json(releases);
    } catch (error) {
        console.error('Error retrieving Release2:', error);
        logger.writeLog(req, { message: 'Internal server error.' }, 'view', 'user')

        return res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.updateRelease2 = async (req, res) => {
    const { id } = req.params;
    const {
        lyricist,
        composer,
        primaryArtist,
        featuringArtist,
        addRelease1Id
    } = req.body;

    try {
        // to check if the release with the provided id exists
        const release = await AllModels.addRelease2Model.findByPk(id);
        if (!release) {
            return res.status(404).json({ message: 'Release not found.' });
        }

        // to check if composer is provided and update the release
        if (composer) {
            release.composer = composer;
        }

        // to check the length of primaryArtist and featuringArtist arrays
        if (primaryArtist) {
            const primaryArtistArray = primaryArtist ? primaryArtist.split(', ').map(item => item.replace(/"/g, '')) : [];

            if (primaryArtistArray.length > 3) {
                return res.status(400).json({ message: 'Invalid input. primaryArtist should have at most 3 elements and featuringArtist should have at most 10 elements.' });
            }
            release.primaryArtist = primaryArtist;

        }
        if (featuringArtist) {
            const featuringArtistArray = featuringArtist ? featuringArtist.split(', ').map(item => item.replace(/"/g, '')) : [];
            console.log("the length is : " + featuringArtistArray.length)
            if (featuringArtistArray.length > 10) {
                return res.status(400).json({ message: 'Invalid input. primaryArtist should have at most 3 elements and featuringArtist should have at most 10 elements.' });
            }
            release.featuringArtist = featuringArtist;
        }

        // to update other fields
        release.lyricist = lyricist || release.lyricist;
        release.addRelease1Id = addRelease1Id || release.addRelease1Id;

        // to save the updated release object to the database
        await release.save();

        return res.status(200).json({ message: 'Release updated successfully.', release });
    } catch (error) {
        console.error('Error updating release:', error);
        return res.status(500).json({ message: 'Internal server error. Check console.' });
    }
};

exports.deleteRelease = async (req, res) => {
    const { id } = req.params;

    try {
        // to find the release by ID
        const release = await AllModels.addRelease2Model.findByPk(id);

        if (!release) {
            return res.status(404).json({ message: 'Release not found.' });
        }

        // to delete the release
        await release.destroy();

        return res.status(200).json({ message: 'Release deleted successfully.' });
    } catch (error) {
        console.error('Error deleting release:', error);
        return res.status(500).json({ message: 'Internal server error. Check console.' });
    }
};

// to get user's data from both addRelease1 & 2
exports.getUserData = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if userId is provided
        if (!userId) {
            logger.writeLog(req, { message: 'userId is required.' }, 'view', 'user')

            return res.status(400).json({ message: 'userId is required.' });
        }

        // to retrieve addRelease1 records associated with the userId
        const addRelease1Records = await AllModels.addRelease1Model.findAll({
            where: { userId },
            include: [
                { model: AllModels.genreModel, as: 'genre' },
                { model: AllModels.subGenreModel, as: 'subgenre' },
                { model: AllModels.moodModel, as: 'mood' },
                { model: AllModels.assetsModel, as: 'asset' }, // Include the assets model
            ]
        });

        // Check if addRelease1 records exist for the userId
        if (addRelease1Records.length === 0) {
            logger.writeLog(req, { message: 'No addRelease1 records found for the provided userId.' }, 'view', 'user')

            return res.status(404).json({ message: 'No addRelease1 records found for the provided userId.' });
        }

        // to retrieve addRelease2 records associated with the addRelease1 ids
        const addRelease1Ids = addRelease1Records.map(record => record.id);
        const addRelease2Records = await AllModels.addRelease2Model.findAll({
            where: { addRelease1Id: { [Op.in]: addRelease1Ids } },
        });


        // prepare the response data!!
        const primaryArtistIds = [];
        const featuringArtistIds = [];
        const userData = {
            userId,
            addRelease1: addRelease1Records,
            addRelease2: addRelease2Records,
        };

        const AR2 = userData.addRelease2;
        for (const map of AR2) {
            console.log(map.primaryArtist);
            if (map.primaryArtist) {
                map.primaryArtist = map.primaryArtist.map(str => parseInt(str.replace(/"/g, "")));
                primaryArtistIds.push(...map.primaryArtist);
            }
            const primaryArtistNames = await AllModels.userArtistModel.findAll({
                where: { id: { [Op.in]: primaryArtistIds } },
                attributes: ['id', 'firstName', 'lastName']
            });
            console.log('Primary Artist Names:');
            console.log(primaryArtistNames.map(artist => artist.get({ plain: true })));

            map.primaryArtist = primaryArtistNames.map(artist => artist.firstName + " " + artist.lastName);
            primaryArtistIds.length = 0;
        }

        for (const map of AR2) {
            console.log(map.featuringArtist);
            if (map.primaryArtist) {
                map.featuringArtist = map.featuringArtist.map(str => parseInt(str.replace(/"/g, "")));
                featuringArtistIds.push(...map.featuringArtist);
            }
            const featuringArtistNames = await AllModels.userArtistModel.findAll({
                where: { id: { [Op.in]: featuringArtistIds } },
                attributes: ['id', 'firstName', 'lastName']
            });
            console.log('featuring Artist Names:');
            console.log(featuringArtistNames.map(artist => artist.get({ plain: true })));

            map.featuringArtist = featuringArtistNames.map(artist => artist.firstName + " " + artist.lastName);
            featuringArtistIds.length = 0;
        }

        logger.writeLog(req, userData, 'view', 'user')
        return res.status(200).json(userData);

    } catch (error) {
        console.error('Error retrieving user data:', error);
        logger.writeLog(req, { message: 'Internal server error.' }, 'view', 'user')

        return res.status(500).json({ message: 'Internal server error.' });
    }
};