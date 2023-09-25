const Sequelize = require("sequelize");
const dbConn = require("../Utils/dbConnect");

const Country = dbConn.define("country", {
    countryCode : {
        type : Sequelize.STRING,
        allowNull : false
    },
    countryName : {
        type : Sequelize.STRING,
        allowNull : false
    },
});

module.exports = Country;