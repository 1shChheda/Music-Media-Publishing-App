const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors()); // CORS middleware (to allow resource access to any domain)

const dbConn = require('./Utils/dbConnect');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const All_Model_Relationship = require('./Utils/allModelRelations')();

// error handling middleware
// if an error occurs in any of the previous middleware or route handlers, this middleware will be called
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal Server Error';

    console.log(`[${new Date().toUTCString()}] ${req.method} ${req.url} - Status ${statusCode}: ${errMessage}`);

    return res.status(statusCode).json({ error: errorMessage });
});

dbConn.sync({ force: true });

app.listen(process.env.PORT, () => {
    console.log(`Server is running at Port ${process.env.PORT}...`);
});