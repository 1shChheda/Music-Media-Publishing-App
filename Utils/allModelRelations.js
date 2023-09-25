const Models = require("../Utils/allModels");
const sequelize = require("sequelize");

const modelRelations = () => {
    // user and country
    Models.userModel.belongsTo(Models.countryModel);
    Models.countryModel.hasMany(Models.userModel);

    // user and otp
    Models.userModel.hasOne(Models.userOtpModel);
    Models.userOtpModel.belongsTo(Models.userModel);
}

module.exports = modelRelations;