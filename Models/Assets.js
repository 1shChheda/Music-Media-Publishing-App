const Sequelize = require('sequelize');
const db = require('../Utils/dbConnect');

const assets = db.define('assets', {
    artwork: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    audio: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

module.exports = assets