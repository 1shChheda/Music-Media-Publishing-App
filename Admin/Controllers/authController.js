const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken')
const AllModels = require("../../Utils/allModels");
const bcrypt = require('bcrypt');
const saltRound = 10
const logger = require("../../Utils/logger");

exports.createAdmin = async (req, res) => {
    try {
        const password = req.body.password;
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(saltRound);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await AllModels.adminModel.create({
            emailAddress: req.body.emailAddress,
            name: req.body.name,
            password: hashedPassword,
            phoneNo: req.body.phoneNo
        })

        if (admin) {
            return res.status(200).json({
                message: "Admin created succesfully",
                admin: admin
            })
        } else {
            return res.status(500).json({
                message: "Admin not created",
                // user:user
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            error: error
        })
    }
}

exports.loginController = async (req, res) => {
    const { emailAddress, password } = req.body;

    try {
        // Check if the user exists
        const admin = await AllModels.adminModel.findOne({ where: { emailAddress: emailAddress } });
        if (!admin) {
            const RESPONSE = { error: "Admin not found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(401).json(RESPONSE);
        }

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            const RESPONSE = { error: 'Invalid Password' };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(401).json(RESPONSE);
        }

        const accessToken = jwt.sign(
            { userID: admin.id, emailAddress: emailAddress },
            process.env.ADMIN_JWT_SECRET,
            { expiresIn: "120s" }
        );

        const refreshToken = jwt.sign(
            { userID: admin.id, emailAddress: emailAddress },
            process.env.ADMIN_JWT_REFRESH_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("ARjwt", refreshToken);

        res.cookie("AAjwt", accessToken);

        const RESPONSE = { message: "Login Successful!" };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);

    } catch (error) {
        console.error(error);
        const RESPONSE = { error: 'Internal Server Error' };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};