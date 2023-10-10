const AllModels = require("../../Utils/allModels");
const logger = require('../../Utils/logger')

exports.ViewMood = async (req, res, next) => {
    try {

        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        const mood = await AllModels.moodModel.findAll({
            attributes: ["id", "mood"],
        });

        const RESPONSE = { mood: mood };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};

exports.AddMood = async (req, res, next) => {
    try {

        const { mood } = req.body;
        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        const existingMood = await AllModels.moodModel.findOne({
            where: {
                mood: mood
            }
        });

        if (existingMood) {
            const RESPONSE = { message: `${existingMood.dataValues.mood} mood already exists!` };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(409).json(RESPONSE);
        }

        const newMood = await AllModels.moodModel.create({
            mood: mood,
        });

        const RESPONSE = { message: "Mood has been Added!", newMood }
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};

exports.UpdateMood = async (req, res, next) => {
    try {
        const updatedMood = await AllModels.moodModel.update(
            {
                mood: req.body.mood,
            },
            {
                where: {
                    id: req.body.id,
                },
            }
        );

        const RESPONSE = { message: "Mood has been Updated!" };
        logger.writeLog(req, RESPONSE, "view", "admin");
        res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};

exports.DeleteMood = async (req, res, next) => {
    try {
        await AllModels.moodModel.destroy({
            where: {
                id: req.params.id,
            },
        });

        const RESPONSE = { message: "Mood has been Deleted!" }
        logger.writeLog(req, RESPONSE, "view", "admin");
        res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};
