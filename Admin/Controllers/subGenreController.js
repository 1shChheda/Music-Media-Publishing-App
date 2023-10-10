const AllModels = require("../../Utils/allModels");
const logger = require('../../Utils/logger')

exports.viewSubGenre = async (req, res, next) => {
    try {

        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        const subGenre = await AllModels.subGenreModel.findAll({
            attributes: ["id", "subGenre"],
            include: [
                {
                    model: AllModels.genreModel,
                    attributes: ["id", "genre"],
                },
            ],
        });

        const RESPONSE = { subGenre: subGenre };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        res.status(500).json(RESPONSE);
    }
};

exports.AddSubGenre = async (req, res, next) => {
    try {

        const { subGenre, genreId } = req.body;

        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        const existingSubGenre = await AllModels.subGenreModel.findOne({
            where: {
                subGenre: subGenre
            }
        });

        if (existingSubGenre) {
            const RESPONSE = { message: `${existingSubGenre.dataValues.subGenre} genre already exists!` };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(409).json(RESPONSE);
        }

        const newSubGenre = await AllModels.subGenreModel.create({
            subGenre: subGenre,
            //   active: req.body.active,
            genreId: genreId,
        });

        const RESPONSE = { newSubGenre };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        res.status(500).json(RESPONSE);
    }
};

exports.UpdateSubGenre = async (req, res, next) => {
    try {

        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        const updatedSubGenre = await AllModels.subGenreModel.update(
            {
                subGenre: req.body.subGenre,
                // active: req.body.active,
                genreId: req.body.genreId,
            },
            {
                where: {
                    id: req.body.subGenreId,
                },
            }
        );

        const RESPONSE = { updatedSubGenre };
        logger.writeLog(req, RESPONSE, "view", "admin");
        res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        res.status(500).json(RESPONSE);
    }
};

exports.DeleteSubGenre = async (req, res, next) => {
    try {

        const subGenre = await AllModels.subGenreModel.destroy({
            where: {
                id: req.params.id,
            },
        });

        const RESPONSE = { message: "SubGenre Deleted" };
        logger.writeLog(req, RESPONSE, "view", "admin");
        res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        res.status(500).json(RESPONSE);
    }
};
