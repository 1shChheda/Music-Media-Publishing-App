const Sequelize = require('sequelize');
const db = require('../Utils/dbConnect');

const Admin = db.define('admin', {
    name: Sequelize.STRING,
    emailAddress: Sequelize.STRING,
    phoneNo: Sequelize.STRING,
    password: Sequelize.STRING
})

module.exports = Admin;