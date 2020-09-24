// Importing external and core packages.
const fetch = require('node-fetch');
const { validationResult } = require('express-validator');

// Importing own packages.
const cnsts = require("../config/constants");
const { manageBadRequests, createError, isEmptyArray } = require("../utils/utils");
const { getOwners, getOwnerInfoAndPosts, getPostComments } = require("../services/owner.services");

/**
* @api {get} /api/owners
*
* @apiParam {Number} [page] 
* @apiParam {Number} [limit]
*/
exports.findAll = async (req, res, next) => {

	try{

	// Validate params and manage bad requests (creating a blacklist for the possible hackers).
	const validation_errors = validationResult(req);

    if (!validation_errors.isEmpty()) {
      throw createError(400, 'Bad requests. Params are needed in their correct format', validation_errors.array());
    }

    // Reading page
    let page = Number(req.query.page) || cnsts.controllers.owner.MIN_OFFSET_REQUESTS;

    let	owners_info = await getOwners(page);

    // Send complete response, according to our own pagination.
    res.status(200).json(owners_info);

	} catch(err) { next(err); }

}