/*
* This is the validate function of Company controller. It follows the syntax of express-validator to check
* that body, params and queries are well-formed. And return an error otherwise.
*/
const { body, query, param } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'create': {
     return [ 
        body('name', 'Invalid name').exists().not().isEmpty().trim(),
        body('description', 'Invalid description').exists().not().isEmpty().trim(),
        body('email', 'Invalid email').exists().not().isEmpty().trim().isEmail().normalizeEmail(),
        body('cif', 'Invalid cif').exists().not().isEmpty().trim().custom((value, { req }) => {
          let re = /^[A-Z]\d{8}$/;
          if (!re.test(value)) {
            throw new Error('CIF must to be a capital letter followed by eight numbers');
          }
          
          return true;
        }),
        body('logo', 'Invalid logo').exists().not().isEmpty().trim(),
        body('shortdesc', 'Invalid shortdesc').optional().trim(),
        body('ccc', 'Invalid ccc').optional().trim(),
        body('date', 'Invalid date').optional().trim(),
        body('status', 'Status is not a boolean').optional().isBoolean()
       ]   
    }
    case 'update': {
      return [ 
        body('id', 'You cannot upload the id of a company').not().exists(),
        body('name', 'Invalid name').optional().not().isEmpty().trim(),
        body('description', 'Invalid description').optional().not().isEmpty().trim(),
        body('email', 'You cannot upload the email of a company').not().exists(),
        body('cif', 'You cannot upload the cif of a company').not().exists(),
        body('logo', 'Invalid logo').optional().not().isEmpty().trim(),
        body('shortdesc', 'Invalid shortdesc').optional().not().isEmpty().trim(),
        body('ccc', 'Invalid ccc').optional().not().isEmpty().trim(),
        body('date', 'You cannot upload the date of a company').not().exists(),
        body('status', 'Status is not a boolean').optional().isBoolean()
       ]
    }
  }
}