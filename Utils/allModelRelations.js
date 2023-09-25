const Models = require("../Utils/allModels");
const sequelize = require("sequelize");

const modelRelations = () => {
    // user and country
    Models.userModel.belongsTo(Models.countryModel);
    Models.countryModel.hasMany(Models.userModel);

    // user and otp
    Models.userModel.hasOne(Models.userOtpModel);
    Models.userOtpModel.belongsTo(Models.userModel);

    // user and AddRelease1 (songs)
    Models.userModel.hasMany(Models.addRelease1Model); //1 user can have many songs and songs must belong->user
    Models.addRelease1Model.belongsTo(Models.userModel);

    // between AddRelease1 (songs) and assets
    Models.addRelease1Model.hasOne(Models.assetsModel); //each song has 1 asset and asset will belong to songs
    Models.assetsModel.belongsTo(Models.addRelease1Model);

    // between artists and songs
    // one song can have many artist and artist must belong to songs/user(can't decide)
}

module.exports = modelRelations;