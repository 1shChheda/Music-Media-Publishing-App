const bcrypt = require('bcrypt');
const saltRound = 10;
const AllModels = require("../../Utils/allModels");
const logger = require("../../Utils/logger");

exports.createAdmin = async (req, res) => {
    try {
        const allowedEmailAddresses = ["1shvenom786@gmail.com"]; // I can add more such `super admin`
        const { phoneNo, emailAddress, password, name } = req.body;

        if (!allowedEmailAddresses.includes(req.admin.emailAddress)) {
            const RESPONSE = { message: "Access Denied" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(401).json(RESPONSE);
        }
        const admin = await AllModels.adminModel.findOne({ where: { emailAddress: emailAddress } });

        if (admin) {
            const RESPONSE = { message: "Email Address Already Exists!" };
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

        const RESPONSE = { message: "Admin Created Successfully!", data: newAdmin };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);

    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};

exports.getAllAdmins = async (req, res) => {
    try {
        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found!" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        const allowedEmailAddresses = ["1shvenom786@gmail.com"]; // I can add more such `super admin`;

        if (!allowedEmailAddresses.includes(req.admin.emailAddress)) {
            const RESPONSE = { message: "Access Denied" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(401).json(RESPONSE);
        }

        const admins = await AllModels.adminModel.findAll();

        const RESPONSE = { admins: admins };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);

    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        const allowedEmailAddresses = ["1shvenom786@gmail.com"]; // I can add more such `super admin`;

        if (!allowedEmailAddresses.includes(req.admin.emailAddress)) {
            const RESPONSE = { message: "Access Denied" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(401).json(RESPONSE);
        }

        const { phoneNo, emailAddress, password, name, adminId } = req.body;

        if (!adminId) {
            const RESPONSE = { error: "Please Mention the AdminId!" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        const admin = await AllModels.adminModel.findOne({ where: { id: adminId } });

        if (!admin) {
            const RESPONSE = { error: "Admin Not Found!" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        let hashedPassword;
        // new Password hashing
        if (password) {
            const salt = await bcrypt.genSalt(saltRound);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const updatedAdmin = await admin.update({
            phoneNo: phoneNo || admin.phoneNo,
            emailAddress: emailAddress || admin.emailAddress,
            password: hashedPassword || admin.password,
            name: name || admin.name
        });

        const RESPONSE = { message: "Admin Updated Successfully!", admin: updatedAdmin };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        if (!req.is_admin_exist) {
            const RESPONSE = { error: "Admin Not Found" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        const allowedEmailAddresses = ["1shvenom786@gmail.com"]; // I can add more such `super admin`;

        if (!allowedEmailAddresses.includes(req.admin.emailAddress)) {
            const RESPONSE = { message: "Access Denied" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(401).json(RESPONSE);
        }

        const adminToBeDeleted = await AllModels.adminModel.findOne({ where: { id: req.params.id } });

        if (!adminToBeDeleted) {
            const RESPONSE = { error: "No Such Admin Found!" };
            logger.writeLog(req, RESPONSE, "view", "admin");
            return res.status(404).json(RESPONSE);
        }

        const admin = await AllModels.adminModel.destroy({ where: { id: req.params.id } });

        const RESPONSE = { message: "Admin Deleted!", admin: adminToBeDeleted };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(200).json(RESPONSE);
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};

exports.banController = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await AllModels.userModel.findByPk(userId);
        if (!user.active) {
            return res.status(200).json({
                message: "User is Already Banned"
            })
        }
        user.active = false;
        await user.save();
        res.status(200).json({ message: "User banned" });
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.removeBanController = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await AllModels.userModel.findByPk(userId);
        if (user.active) {
            return res.status(200).json({
                message: "User is Already UnBanned"
            })
        }
        user.active = true;
        await user.save();
        res.status(200).json({ message: "User Unbanned" });
    } catch (error) {
        res.status(500).send(error);
    }
}