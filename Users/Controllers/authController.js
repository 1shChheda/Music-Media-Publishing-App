const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const AllModels = require("../../Utils/allModels");
const otpGenerate = require("../../Utils/otpGenerate");
const logger = require('../../Utils/logger');

exports.User_Signup = async (req, res) => {
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
        }

        let user = await AllModels.userModel.findOne({ where: { [Op.or]: [{ emailAddress: req.body.emailAddress }, { phoneNumber: req.body.phoneNumber }] } });
        if (user) {
            const RESPONSE = { error: "User Already Exist" }
            logger.writeLog(req, RESPONSE, 'view', 'user')
            return res.status(402).json(RESPONSE);
        }
        user = await AllModels.userModel.create(data);

        // What to do with newly created user? LEFT TO CODE (OTP, etc)

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}