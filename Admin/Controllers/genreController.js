const AllModels = require('../../Utils/allModels');
const logger = require('../../Utils/logger')

exports.ViewGenre = async (req, res, next) => {
    try {

        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        const genre = await AllModels.genreModel.findAll({
            attributes: ["id", "genre"],
            include: [
                {
                    model: AllModels.subGenreModel,
                    attributes: ["id", "subGenre"],
                },
            ],
        });

        const RESPONSE = { genre: genre };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};

exports.AddGenre = async (req, res, next) => {
    try {

        const { genre } = req.body;
        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        const existingGenre = await AllModels.genreModel.findOne({
            where: {
                genre: genre
            }
        });

        if (existingGenre) {
            const RESPONSE = { message: `${existingGenre.dataValues.genre} genre already exists!` };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(409).json(RESPONSE);
        }

        const newGenre = await AllModels.genreModel.create({
            genre: genre,
            //   active: req.body.active,
        });

        const RESPONSE = { message: "Genre has been Added", newGenre };
        logger.writeLog(req, RESPONSE, "view", "admin");
        res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};

exports.UpdateGenre = async (req, res, next) => {
    try {

        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        const updatedGenre = await AllModels.genreModel.update(
            {
                genre: req.body.genre,
                // active: req.body.active,
            },
            {
                where: {
                    id: req.body.id,
                },
            }
        );
        const RESPONSE = { message: "Genre has been Updated!" };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};

exports.DeleteGenre = async (req, res, next) => {
    try {

        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        await AllModels.genreModel.destroy({
            where: {
                id: req.params.id,
            },
        });

        const RESPONSE = { message: "Genre Deleted" };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};
