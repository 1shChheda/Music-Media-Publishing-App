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
    genre: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    subGenre: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    mood: {
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
    }

})

module.exports = addRelease1