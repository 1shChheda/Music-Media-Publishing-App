const AllModels = require("../../Utils/allModels");
const logger = require('../../Utils/logger')

exports.ViewMood = async (req, res, next) => {
    try {

        const mood = await AllModels.moodModel.findAll({
            attributes: ["id", "mood"],
        });

        logger.writeLog(req, { mood: mood }, "view", 'user');
        res.status(200).json({ mood: mood });

    } catch (error) {
        logger.writeLog(req, { error: error.message }, "view", 'user');
        res.status(500).json({ error: error.message });
    }
};

exports.AddMood = async (req, res, next) => {
    try {
        await AllModels.moodModel.create({
            mood: req.body.mood,
        });

        logger.writeLog(req, { message: "Mood has been Added" }, "view", 'user');
        res.status(200).json({ message: "Mood has been Added" });

    } catch (error) {
        logger.writeLog(req, { error: error.message }, "view", 'user');
        res.status(500).json({ error: error.message });
    }
};

exports.UpdateMood = async (req, res, next) => {
    try {
        await AllModels.moodModel.update(
            {
                mood: req.body.mood,
            },
            {
                where: {
                    id: req.body.id,
                },
            }
        );

        logger.writeLog(req, { message: "Mood has been Updated" }, "view", 'user');
        res.status(200).json({ message: "Mood has been Updated" });

    } catch (error) {
        logger.writeLog(req, { error: error.message }, "view", 'user');
        res.status(500).json({ error: error.message });
    }
};

exports.DeleteMood = async (req, res, next) => {
    try {
        await AllModels.moodModel.destroy({
            where: {
                id: req.params.id,
            },
        });

        logger.writeLog(req, { message: "Mood has been Deleted" }, "view", 'user');
        res.status(200).json({ message: "Mood has been Deleted" });
        
    } catch (error) {
        logger.writeLog(req, { error: error.message }, "view", 'user');
        res.status(500).json({ error: error.message });
    }
};
