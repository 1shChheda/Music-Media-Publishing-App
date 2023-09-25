const Sequelize = require('sequelize')
const db = require('../Utils/dbConnect');

const primaryArtist = db.define('primaryArtist', {
    firstName: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    lastName: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    spotifyURL: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    appleURL: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    instagramURL: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    youtubeURL: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

module.exports = primaryArtist