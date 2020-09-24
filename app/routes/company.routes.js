// Import controller.
const companies = require('../controllers/company.controller.js');

// Import validation and security middlewares.
const { validate } = require('../middlewares/validation/company.validation.middlewares');

// Create router object.
let router = require("express").Router();

	// Define Company routes.
	router.post("/", validate('create'), companies.create);

// Export router with all of our routes.
module.exports = router;