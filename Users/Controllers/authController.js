const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const AllModels = require("../../Utils/allModels");

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
        }

        let user = await AllModels.userModel.findOne({
            where: {
                [Op.or]: [
                    { emailAddress: req.body.emailAddress },
                    { phoneNumber: req.body.phoneNumber }
                ]
            }
        });

        if (user) {
            const RESPONSE = { error: "User Already Exists" }
            return res.status(402).json(RESPONSE);
        }
        user = await AllModels.userModel.create(data);

        if (user) {
            // EXTRA : We can send a "Welcome to Music Distribution App" sms on successful signup
            const RESPONSE = {
                message: 'Signup successfully',
                user: user
            }
            return res.status(201).json(RESPONSE)
        }
        else {
            const RESPONSE = { error: "Something went wrong" }
            return res.status(400).json(RESPONSE);
        }

    } catch (error) {
        const RESPONSE = { error: error.message }
        return res.status(500).json(RESPONSE)
    }
}

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
            const RESPONSE = { error: "User not found" }
            return res.status(401).json(RESPONSE);
        }

        // else we do the otpGenerate & ( start verification process in another controller )

        const userOtp = await AllModels.userOtpModel.findOne({
            where: {
                phoneCountryCode: req.body.phoneCountryCode,
                phoneNumber: req.body.phoneNumber
            }
        });

        if (userOtp) {
            const timeDifference = Math.floor((new Date() - userOtp.updatedAt) / 1000);
            const otpRegenerationTime = 30;

            if (timeDifference < otpRegenerationTime) {
                const secondsLeft = otpRegenerationTime - timeDifference;
                const RESPONSE = { error: `Please wait ${secondsLeft} seconds before generating a new OTP` }
                return res.status(429).json(RESPONSE);
            }
        }

        const { Otp, expiryDatetime } = otpGenerate();
        if (!Otp) {
            const RESPONSE = { errors: "Something went wrong. Please try again" }
            return res
                .status(500)
                .json(RESPONSE);
        }

        if (userOtp) {
            userOtp.otp = Otp;
            userOtp.expiry = expiryDatetime;
            await userOtp.save();

        } else {
            userOtp = await AllModels.userOtpModel.create({
                phoneCountryCode: req.body.phoneCountryCode,
                phoneNumber: req.body.phoneNumber,
                otp: Otp,
                expiry: expiryDatetime,
                userId: user.id
            });
        }

        if (userOtp) {
            const RESPONSE = { message: 'OTP sent successfully' }
            return res.status(200).json(RESPONSE)
        }

        // now, we send the otp to the user, via sms (to phoneNumber)

    } catch (error) {
        const RESPONSE = { error: error.message }
        return res.status(500).json(RESPONSE);
    }
}