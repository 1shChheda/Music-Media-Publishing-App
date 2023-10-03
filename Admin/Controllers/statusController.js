const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const AllModels = require("../../Utils/allModels");
const logger = require("../../Utils/logger");

exports.statusUpdater = async (req, res) => {
    try {
        const addrelease1Id = req.params.addrelease1Id;
        const newStatus = req.body.status;

        if (!newStatus) {
            const RESPONSE = { message: 'No status provided in the request.' };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(400).json(RESPONSE);
        }

        const addReleaseToUpdate = await AllModels.addRelease1Model.findByPk(addrelease1Id);

        if (!addReleaseToUpdate) {
            const RESPONSE = { message: `Release with ID ${addrelease1Id} not found.` };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        // to update the status field in the model
        addReleaseToUpdate.status = newStatus;
        await addReleaseToUpdate.save();

        const RESPONSE = { message: 'Status updated successfully!', data: addReleaseToUpdate };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.json(RESPONSE);
    } catch (err) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        res.status(500).json(RESPONSE);
    }
};