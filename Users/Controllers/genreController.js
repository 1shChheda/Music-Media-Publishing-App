const AllModels = require('../../Utils/allModels');
const logger = require('../../Utils/logger')

exports.ViewGenre = async (req, res, next) => {
    try {

        const genre = await AllModels.genreModel.findAll({
            attributes: ["id", "genre"],
            include: [
                {
                    model: AllModels.subGenreModel,
                    attributes: ["id", "subGenre"],
                },
            ],
        });

        logger.writeLog(req, { genre: genre }, "view", 'user');
        return res.status(200).json({ genre: genre });
    } catch (error) {
        logger.writeLog(req, { error: error.message }, "view", 'user');
        return res.status(500).json({ error: error.message });
    }
};

exports.AddGenre = async (req, res, next) => {
    try {
        await AllModels.genreModel.create({
            genre: req.body.genre,
            //   active: req.body.active,
        });

        logger.writeLog(req, { message: "Genre has been Added" }, "view", 'user');
        return res.status(200).json({ message: "Genre has been Added" });
    } catch (error) {
        logger.writeLog(req, { error: error.message }, "view", 'user');
        return res.status(500).json({ error: error.message });
    }
};

exports.UpdateGenre = async (req, res, next) => {
    try {


        await AllModels.genreModel.update(
            {
                genre: req.body.genre,
                // active: req.body.active,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
    } catch (error) {
        logger.writeLog(req, { error: error.message }, "view", 'user');
        res.status(500).json({ error: error.message });
    }
};

exports.DeleteGenre = async (req, res, next) => {
    try {

        await AllModels.genreModel.destroy({
            where: {
                id: req.params.id,
            },
        });
        logger.writeLog(req, { message: "Genre Deleted" }, "view", 'user');


        res.status(200).json({ message: "Genre Deleted" });
    } catch (error) {
        logger.writeLog(req, { error: error.message }, "view", 'user');
        res.status(500).json({ error: error.message });
    }
};
