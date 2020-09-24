/*
* This is the erros middlewares file. It only has a simple function that manage all the errors that were
* throwed by all the methods of the api, inside of server.js.
*/
const { createResponse } = require('../../utils/utils');

exports.errorHandler = (error, req, res, next) => {
	res.status(error.statusCode || 500).json(createResponse(error.statusCode || 500, error.message, error.data || null));
}