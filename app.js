const express = require("express");
const bodyParser = require("body-parser");

require('dotenv').config();

const app = express();

const dbConn = require('./Utils/dbConnect');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

dbConn.sync({ force: false });

app.listen(process.env.PORT, () => {
    console.log(`Server is running at Port ${process.env.PORT}...`);
})