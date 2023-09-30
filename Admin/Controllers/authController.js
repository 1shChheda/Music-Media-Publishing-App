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
            emailAddress: req.body.email,
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

exports.adminLogin = async (req, res) => {
    const { password } = req.body;

    try {
        // Check if the user exists
        // const user = await userModel.allModels.userModel.findOne({ where: { email:req.body.email } });
        const user = await AllModels.adminModel.findOne({ where: { emailAddress: req.body.email } });
        if (!user) {
            // logger.writeLog(req, "User not found", 'view');
            return res.status(401).json({ error: "Admin not found" });
        }

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Create and sign the JWT token
        //now we come to token part
        const token = jwt.sign({
            email: user.email,
        },
            'secret',
            {
                expiresIn: "12h"
            })


        return res.json({
            message: 'Logged in Successfully',
            token: token,
        })

        //   console.log(req.user.userID)

        // return res.json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};