const Sequelize = require('sequelize');
const db = require('../Utils/dbConnect');

const Mood = db.define('mood', {
    mood: {
        type: Sequelize.TEXT
    }
})

module.exports = Mood