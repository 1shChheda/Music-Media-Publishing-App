const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const AllModels = require("../../Utils/allModels");
const logger = require("../../Utils/logger");
const tokenVerifyMiddleware = require("../Middleware/tokenVerify");

exports.userSignup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let data = {
            name: req.body.name,
            emailAddress: req.body.emailAddress,
            gender: req.body.gender,
            DOB: req.body.DOB,
            phoneCountryCode: req.body.phoneCountryCode,
            phoneNumber: req.body.phoneNumber,
            countryId: req.body.countryId
        };

        let user = await AllModels.userModel.findOne({
            where: {
                [Op.or]: [
                    { emailAddress: req.body.emailAddress },
                    { phoneNumber: req.body.phoneNumber }
                ]
            }
        });

        if (user) {
            const RESPONSE = { error: "User Already Exists" };
            logger.writeLog(req, RESPONSE, "view", "user");
            return res.status(402).json(RESPONSE);
        }

        user = await AllModels.userModel.create(data);

        if (user) {
            const RESPONSE = {
                message: "Signup Successfully",
                user: user,
            };
            logger.writeLog(req, RESPONSE, "view", "user");
            return res.status(201).json(RESPONSE);
        } else {
            const RESPONSE = { error: "Something went wrong" };
            logger.writeLog(req, RESPONSE, "view", "user");
            return res.status(400).json(RESPONSE);
        }
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "user");
        return res.status(500).json(RESPONSE);
    }
};

exports.userLogin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let user = await AllModels.userModel.findOne({
            where: {
                phoneCountryCode: req.body.phoneCountryCode,
                phoneNumber: req.body.phoneNumber
            }
        });

        if (!user) {
            const RESPONSE = { error: "User not found" };
            logger.writeLog(req, RESPONSE, "view", "user");
            return res.status(401).json(RESPONSE);
        }

        if (user) {
            const RESPONSE = {
                message: "Login Successfully",
                user: user,
            };
            logger.writeLog(req, RESPONSE, "view", "user");
            return res.status(201).json(RESPONSE);
        } else {
            const RESPONSE = { error: "Something went wrong" };
            logger.writeLog(req, RESPONSE, "view", "user");
            return res.status(400).json(RESPONSE);
        }
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "user");
        return res.status(500).json(RESPONSE);
    }
};