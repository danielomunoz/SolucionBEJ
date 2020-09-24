/*
* This is the validate function of Owner controller. It follows the syntax of express-validator to check
* that body, params and queries are well-formed. And return an error otherwise.
*/
const { body, query, param } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'findAll': {
      return [
        query('page', 'Page query param must be an integer').optional().not().isEmpty().isInt(),
        query('limit', 'Limit query param must be an integer').optional().not().isEmpty().isInt()
      ]
    }
    case 'findOwnerAndPosts': {
      return [
        param('id', 'Id must exists and be a number').exists().isInt()
      ]
    }
  }
}