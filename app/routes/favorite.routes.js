// Import controller.
const favorite = require("../controllers/favorite.controller.js");

// Import validation middleware.
const { validate } = require('../middlewares/validation/favorite.validation.middlewares');

// Create router object.
let router = require("express").Router();

	// Define Favorite routes.
	router.post("/", validate('create'), favorite.create);
  
// Export router with all of our routes.
module.exports = router;