// Sequelize imports to interact with database.
const db = require("../models");
const Company = db.company;
const Op = db.Sequelize.Op;

// Importing external and core packages
const crypto = require('crypto');
const { validationResult } = require('express-validator');

// Importing own packages
const cnsts = require("../config/constants");
const { manageBadRequests, createError, createResponse, isEmptyArray } = require("../utils/utils");

/**
* @api {post} /api/companies
*
* @apiParam {String} name
* @apiParam {String} cif
* @apiParam {String} email
* @apiParam {String} description
* @apiParam {String} logo
* @apiParam {String} [shortdesc]
* @apiParam {String} [ccc]
* @apiParam {String} [date]
* @apiParam {Boolean} [status]
*/
exports.create = async (req, res, next) => {

  try{

    // Validate params and manage bad requests (creating a blacklist for the possible hackers).
    const validation_errors = validationResult(req);

    if (!validation_errors.isEmpty()) {
      throw createError(400, 'Bad requests. Params are needed in their correct format', validation_errors.array());
    }

    // Extract params from req.body.
    const { name, description, email, cif, logo, shortdesc, ccc, date, status} = req.body;

    // Looking for an existing row of this company on database.
    let query_company = await Company.findAll({ where: { [Op.or]: [{ cif }, { name }] } });
    if(!isEmptyArray(query_company)) throw createError(409, 'A company with this CIF or name already exists on database');

    // Create company object and database row.
    const company = { name, description, email, cif, logo, shortdesc, ccc, date, status,
                      token: crypto.createHash(cnsts.controllers.company.HASH_ALGORITHM).update(req.body.name + req.body.cif + new Date().getMilliseconds()).digest(cnsts.controllers.company.DIGEST)
    };

    let data = await Company.create(company);

    res.status(200).json(createResponse(200, 'Success creating a new company on db', data));

  }catch(err){ next(err); }

};