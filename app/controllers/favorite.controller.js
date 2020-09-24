// Sequelize imports to interact with database.
const db = require("../models");
const Favorite = db.favorite;
const Company = db.company;

// Importing external and core packages.
const { validationResult } = require('express-validator');
const fetch = require('node-fetch');

// Importing own packages.
const cnsts = require("../config/constants");
const { manageBadRequests, createError, createResponse, isEmptyArray } = require("../utils/utils");
const { getOwner } = require("../services/favorite.services");

/**
* @api {post} /api/favorites
*
* @apiParam {String} ownerId 
* @apiParam {String} companyId
*/
exports.create = async (req, res, next) => {

  try{

    // Validate params and manage bad requests (creating a blacklist for the possible hackers).
    const validation_errors = validationResult(req);

    if (!validation_errors.isEmpty()) {
      manageBadRequests(req);
      throw createError(400, 'Bad requests. Params are needed in their correct format', validation_errors.array());
    }

    // Extract params from req.body;
    const { ownerId, companyId } = req.body;

    // Looking for an existing row of this relationship on database.
    let query_favorite = await Favorite.findAll({ where: { ownerId, companyId } });
    if(!isEmptyArray(query_favorite)) throw createError(409, 'This favorite relationship already exists');

    // Looking if exists the owner in a external database (corresponding to /users api backend), between our service.
    let query_owner_response = await getOwner(ownerId);
    if(query_owner_response.code == cnsts.http_codes.NOT_FOUND) throw createError(404, 'Owner with this ID not found in database');

    // Looking if company exists in our database.
    let companies_array = await Company.findAll({ where: { id: companyId } });
    if(isEmptyArray(companies_array)) throw createError(404, 'Company with this ID not found in database');

    // Creating favorite relationship in our database.
    const favorite = {
      ownerId,
      companyId
    };

    let response = await Favorite.create(favorite);

    res.status(200).json(createResponse(200, 'Success creating a favorite relationship on db', response));

  }catch(err){ next(err); }

}