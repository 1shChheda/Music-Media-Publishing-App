const allModels = require("../Utils/allModels");
const sequelize = require("sequelize");

const modelRelations = () => {
    // user and country
    allModels.Models.userModel.belongsTo(allModels.Models.countryModel);
    allModels.Models.countryModel.hasMany(allModels.Models.userModel);
}

module.exports = modelRelations;