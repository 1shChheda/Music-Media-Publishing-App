const Sequelize = require('sequelize')
const db = require('../Utils/dbConnect');

const addRelease2 = db.define('addRelease2', {
    lyricist: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    composer: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    primaryArtist: {
        type: Sequelize.TEXT,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('primaryArtist');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            // if (value.length > 3) {
            //     throw new Error('Max 3 primary artists are allowed.');
            // }
            this.setDataValue('primaryArtist', JSON.stringify(value));
        }
    },
    featuringArtist: {
        type: Sequelize.TEXT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('featuringArtist');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            // if (value.length > 10) {
            //     throw new Error('Max 10 featuring artists are allowed.');
            // }
            this.setDataValue('featuringArtist', JSON.stringify(value));
        }
    }
})

module.exports = addRelease2