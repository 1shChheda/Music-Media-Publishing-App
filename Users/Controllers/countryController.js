const allModels = require('../../Utils/allModels');

exports.getCountries = async (req, res) => {
    try {
        const country = await allModels.countryModel.findAll();
        const RESPONSE = { country: country }
        res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message }
        return res.status(500).json(RESPONSE);
    }
}

exports.postCountry = async (req, res) => {
    try {
        const { countryCode, countryName } = req.body;

        if (!countryCode) {
            return res.status(400).json({ error: 'countryCode required' });
        }
        if (!countryCode) {
            return res.status(400).json({ error: 'countryName required' });
        }

        // to check if the country already exists
        const existingCountry = await allModels.countryModel.findOne({
            where: { countryCode }
        });

        if (existingCountry) {
            return res.status(400).json({ error: 'Country already exists' });
        }

        // if the country is new, create a new entry
        const newCountry = await allModels.countryModel.create({
            countryCode,
            countryName
        });

        return res.status(200).json(newCountry);
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
            return res.status(404).json({ error: 'Country not found' });
        }

        // to update the country
        existingCountry.countryCode = countryCode;
        existingCountry.countryName = countryName;
        await existingCountry.save();

        console.log('Updated country:', existingCountry);

        return res.status(200).json({ country: existingCountry });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
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
            return res.status(404).json({ error: 'Country not found' });
        }

        // to delete the country
        await existingCountry.destroy();

        console.log('Deleted country:', existingCountry);

        return res.status(200).json({ message: 'Country deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};