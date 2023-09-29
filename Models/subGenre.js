const Sequelize = require('sequelize');
const db = require('../Utils/dbConnect');

const subGenre = db.define('subgenre', {
    subGenre: {
        type: Sequelize.TEXT
    }
})

module.exports = subGenre