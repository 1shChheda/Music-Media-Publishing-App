const AllModels = require("../../Utils/allModels");
const logger = require('../../Utils/logger')

exports.viewSubGenre = async (req, res, next) => {
    try {

        const subGenre = await AllModels.subGenreModel.findAll({
            attributes: ["id", "subGenre"],
            include: [
                {
                    model: AllModels.genreModel,
                    attributes: ["id", "genre"],
                },
            ],
        });

        logger.writeLog(req, { subGenre: subGenre }, "view", 'user');
        res.status(200).json({ subGenre: subGenre });

    } catch (error) {
        logger.writeLog(req, { error: error.message }, "view", 'user')
        res.status(500).json({ error: error.message });
    }
};

exports.AddSubGenre = async (req, res, next) => {
    try {

        const subGenre = await AllModels.subGenreModel.create({
            subGenre: req.body.subGenre,
            //   active: req.body.active,
            genreId: req.body.genreId,
        });

        logger.writeLog(req, { subGenre: subGenre }, "view", 'user')
        res.status(200).json({ subGenre: subGenre });

    } catch (error) {
        logger.writeLog(req, { error: error.message }, "view", 'user')
        res.status(500).json({ error: error.message });
    }
};

exports.UpdateSubGenre = async (req, res, next) => {
    try {

        const subGenre = await AllModels.subGenreModel.update(
            {
                subGenre: req.body.subGenre,
                // active: req.body.active,
                genreId: req.body.genreId,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );

        logger.writeLog(req, { subGenre: subGenre }, "view", 'user')
        res.status(200).json({ subGenre: subGenre });

    } catch (error) {
        logger.writeLog(req, { error: error.message }, "view", 'user')
        res.status(500).json({ error: error.message });
    }
};

exports.DeleteSubGenre = async (req, res, next) => {
    try {

        const subGenre = await AllModels.subGenreModel.destroy({
            where: {
                id: req.params.id,
            },
        });

        logger.writeLog(req, { message: "SubGenre Deleted" }, "view", 'user')
        res.status(200).json({ message: "SubGenre Deleted" });
        
    } catch (error) {
        logger.writeLog(req, { error: error.message }, "view", 'user')
        res.status(500).json({ error: error.message });
    }
};
