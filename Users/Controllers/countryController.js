const allModels = require('../../Utils/allModels');
const logger = require("../../Utils/logger");

exports.getCountries = async (req, res) => {
    try {
        const country = await allModels.countryModel.findAll();
        const RESPONSE = { country: country };
        logger.writeLog(req, RESPONSE, "view", "user");
        res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "user");
        return res.status(500).json(RESPONSE);
    }
}

exports.postCountry = async (req, res) => {
    try {
        const { countryCode, countryName } = req.body;

        // to check if the country already exists
        const existingCountry = await allModels.countryModel.findOne({
            where: { countryCode }
        });

        if (existingCountry) {
            const RESPONSE = { error: 'Country already exists' };
            logger.writeLog(req, RESPONSE, "view", "user");
            return res.status(400).json(RESPONSE);
        }

        // if the country is new, create a new entry
        const newCountry = await allModels.countryModel.create({
            countryCode,
            countryName
        });

        const RESPONSE = { country: newCountry };
        logger.writeLog(req, RESPONSE, "view", "user");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateCountry = async (req, res) => {
    try {
        const { id } = req.params;
        const { countryCode, countryName } = req.body;

        // find the country by ID (from req.params)
        const existingCountry = await allModels.countryModel.findOne({
            where: { id: id }
        });

        if (!existingCountry) {
            const RESPONSE = { error: 'Country not found' };
            logger.writeLog(req, RESPONSE, "view", "user");
            return res.status(404).json(RESPONSE);
        }

        // to update the country
        existingCountry.countryCode = countryCode || existingCountry.countryCode;
        existingCountry.countryName = countryName || existingCountry.countryName;
        await existingCountry.save();

        console.log('Updated country:', existingCountry);

        const RESPONSE = { country: existingCountry };
        logger.writeLog(req, RESPONSE, "view", "user");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        console.log(error);
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "user");
        return res.status(500).json(RESPONSE);
    }
};

exports.deleteCountry = async (req, res) => {
    try {
        const { id } = req.params;

        // find the country by ID (from req.params)
        const existingCountry = await allModels.countryModel.findOne({
            where: { id }
        });

        if (!existingCountry) {
            const RESPONSE = { error: 'Country not found' };
            logger.writeLog(req, RESPONSE, "view", "user");
            return res.status(404).json(RESPONSE);
        }

        // to delete the country
        await existingCountry.destroy();

        console.log('Deleted country:', existingCountry);

        const RESPONSE = { message: `${existingCountry.countryName} Country deleted successfully` };
        logger.writeLog(req, RESPONSE, "view", "user");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        console.log(error);
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "user");
        return res.status(500).json(RESPONSE);
    }
};