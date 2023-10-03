const bcrypt = require('bcrypt');
const saltRound = 10;
const AllModels = require("../../Utils/allModels");
const logger = require("../../Utils/logger");

exports.createAdmin = async (req, res) => {
    try {
        const allowedEmailAddresses = ["1shvenom786@gmail.com"]; // I can add more such `super admin`
        const { phoneNo, emailAddress, password, name } = req.body;

        if (!allowedEmailAddresses.includes(emailAddress)) {
            const RESPONSE = { message: "Access Denied" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(401).json(RESPONSE);
        }
        const admin = await AllModels.adminModel.findOne({ where: { emailAddress: emailAddress } });

        if (admin) {
            const RESPONSE = { message: "Email Address Already Exists" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(409).json(RESPONSE);
        }

        const salt = await bcrypt.genSalt(saltRound);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await AllModels.adminModel.create({
            name: name,
            emailAddress: emailAddress,
            phoneNo: phoneNo,
            password: hashedPassword
        });

        if (!newAdmin) {
            const RESPONSE = { message: "Internal Server Error" }
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(500).json(RESPONSE);
        }

        const RESPONSE = { message: "Admin Created Successfully", data: newAdmin };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);

    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
}