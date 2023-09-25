const { Sequelize } = require("sequelize");

const dbConnection = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER_NAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
        port : process.env.DB_PORT,
      }
);

dbConnection
  .authenticate()
  .then(() => {
    console.log("Connected to Database Successfully!");
  })
  .catch((err) => {
    console.log(`Unable to connect to the database: ${err}`);
  });

module.exports = dbConnection;