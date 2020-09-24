/*
* This is the validate function of Favorite controller. It follows the syntax of express-validator to check
* that body, params and queries are well-formed. And return an error otherwise.
*/
const { body, query, param } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'create': {
     return [ 
        body('ownerId', 'OwnerId is needed and has to be an integer').exists().not().isEmpty().trim().isInt(),
        body('companyId', 'CompanyId is needed and has to be an integer').exists().not().isEmpty().trim().isInt()
       ]   
    }
  }
}