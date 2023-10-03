const Sequelize = require('sequelize')
const db = require('../Utils/dbConnect');

const addRelease1 = db.define('addRelease1', {
    songName: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    labelName: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    releaseDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    language: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    explicit: {
        type: Sequelize.ENUM("Yes", "No"),
        allowNull: false
    },
    ytContentID: {
        type: Sequelize.ENUM("Yes", "No"),
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('Draft', 'Under Review', 'Verified', 'Live', 'Rejected', 'Taken Down'),
        allowNull: false,
        defaultValue: "Under Review"
    }

})

module.exports = addRelease1