// Import controller.
const owners = require("../controllers/owner.controller.js");

// Import validation middleware.
const { validate } = require('../middlewares/validation/owner.validation.middlewares');

// Create router object.
var router = require("express").Router();

	// Define Owners routes.
	router.get("/", validate('findAll'), owners.findAll);
	router.get("/:id", validate('findOwnerAndPosts'), owners.findOwnerAndPosts);

// Export router with all of our routes.
module.exports = router;