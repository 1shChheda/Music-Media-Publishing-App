const Sequelize = require('sequelize');
const db = require('../Utils/dbConnect');

const userOtp = db.define('userOtp', {
    phoneCountryCode: Sequelize.STRING,
    phoneNumber : Sequelize.STRING,
    otp: Sequelize.INTEGER,
    expiry: Sequelize.DATE
});

module.exports = userOtp