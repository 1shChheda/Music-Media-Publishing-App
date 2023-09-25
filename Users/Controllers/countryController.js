const allModels = require('../../Utils/allModels');

exports.getCountries = async(req,res)=>{
    try {
        const country = await allModels.Models.countryModel.findAll();
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

        // to check if the country already exists
        const existingCountry = await allModels.Models.countryModel.findOne({
            where: { countryCode }
        });

        if (existingCountry) {
            return res.status(400).json({ error: 'Country already exists' });
        }

        // if country is new, create new entry
        const newCountry = await allModels.Models.countryModel.create({
            countryCode,
            countryName
        });

        return res.status(200).json(newCountry);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};