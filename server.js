//Importing external and core packages.
const express = require('express');
const bodyParser = require('body-parser');

// Importing routes.
const company_routes = require('./app/routes/company.routes');
const owner_routes = require('./app/routes/owner.routes');
const favorite_routes = require('./app/routes/favorite.routes');

// Importing errors and security middlewares.
const { errorHandler } = require('./app/middlewares/errors/server.errors.middlewares');

const app = express();

// Parse requests of content-type - application/json.
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded.
app.use(bodyParser.urlencoded({ extended: true }));

// Connecting to database between Sequelize and doing a database dump to operate with some info when 
// developing the app.
const db = require("./app/models");
db.sequelize.sync().then(() => {
  require('./app/config/sql_dump.js');
  console.log('Sync to database.');
});

// Adding the routes previously imported.
app.use('/api/companies', company_routes);
app.use('/api/owners', owner_routes);
app.use('/api/favorites', favorite_routes);

// Managing application errors throwed in the course of server operations.
app.use(errorHandler);

// Listen for requests.
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${3000}.`);
});