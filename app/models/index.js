/*
* This is the file needed by Sequelize to establish connection with database and to load the models of
* tables that our database contains. We will require this file into server, controllers and middlewares
* in order to interact with our tables on database using Sequelize.
*/
const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.company = require("./company.model.js")(sequelize, Sequelize);
db.favorite = require("./favorite.model.js")(sequelize, Sequelize);

module.exports = db;