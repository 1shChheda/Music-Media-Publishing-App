const Models = require("../Utils/allModels");
const sequelize = require("sequelize");

const modelRelations = () => {
    // user and country
    Models.userModel.belongsTo(Models.countryModel);
    Models.countryModel.hasMany(Models.userModel);
}

module.exports = modelRelations;