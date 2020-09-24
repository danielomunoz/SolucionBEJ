/*
* This is the security middlewares file for Company controller. The first for verify that user sets a 
* correct token inside the Authentication header in order to update a Company on database, and the 
* second to check the same token, in case that user want to list beyond the 10th page of Companies on
* located on database.
*/

// Require Sequelize packages
const db = require("../../models");
const Company = db.company;

// Require external and core packages
const { validationResult } = require('express-validator');

// Require constants and utils packages.
const cnsts = require("../../config/constants");
const { createError, isUndefined, isEmptyArray, manageBadRequests } = require("../../utils/utils");

exports.verifyCompanyToken = async (req, res, next) => {

  try{

    // Validate params and manage bad requests (creating a blacklist for the possible hackers).
    const validation_errors = validationResult(req);

    if (!validation_errors.isEmpty()) {
      manageBadRequests(req);
      throw createError(400, 'Bad requests. Params are needed in their correct format', validation_errors.array());
    }

    const id = req.params.id;

    // If user don't set the token, the action of updating a company is forbidden.
    if(isUndefined(req.header('Authorization'))) throw createError(403, 'You must include your Authorization token');

    // Extract token from Authorization header.
    const auth_token = req.header('Authorization').split(" ")[1];

    // Ask for a company with the input id.
    let query_company_response = await Company.findAll({ where: { id: id } });

    // Check if we can't find any company with this id or the token is invalid.
    if(isEmptyArray(query_company_response)) throw createError(404, 'There are not results on our database for the id that you introduced');
    if(query_company_response[0].token !== auth_token) throw createError(403, 'Unauthorized action for this Authorization token');

    next();

  }catch(err){ next(err); }

}
