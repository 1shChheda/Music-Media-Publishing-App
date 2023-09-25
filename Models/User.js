const Sequelize = require('sequelize');
const db = require('../Utils/dbConnect');

const User = db.define('user',{
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    name:{
        type:Sequelize.STRING,
        allowNull:true
    },
    gender:{
        type:Sequelize.ENUM('Male','Female','Others'),
        allowNull:true,
    },
    DOB:{
        type:Sequelize.DATEONLY,
        allowNull:false
    },
    phoneCountryCode:{
        type:Sequelize.STRING,
        allowNull:false
    },
    phoneNumber:{
        type:Sequelize.STRING,
        allowNull:false
    },
    
})

module.exports = User;