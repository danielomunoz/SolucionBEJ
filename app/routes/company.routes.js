// Import controller.
const companies = require('../controllers/company.controller.js');

// Import validation and security middlewares.
const { validate } = require('../middlewares/validation/company.validation.middlewares');
const { verifyCompanyToken, verifyListingLimitToken } = require('../middlewares/security/company.security.middlewares');

// Create router object.
let router = require("express").Router();

	// Define Company routes.
	router.post("/", validate('create'), companies.create);
	router.put("/:id", validate('update'), verifyCompanyToken, companies.update);
	router.get("/", validate('findAll'), verifyListingLimitToken, companies.findAll);
	router.get("/:pattern", validate('search'), companies.search);

// Export router with all of our routes.
module.exports = router;