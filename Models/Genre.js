const Sequelize = require('sequelize');
const db = require('../Utils/dbConnect');

const genre = db.define('genre', {
    genre: {
        type: Sequelize.TEXT
    }
})

module.exports = genre