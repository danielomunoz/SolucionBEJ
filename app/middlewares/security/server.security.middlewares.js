/*
* This is the server security middleware. It only contains a tiny but important functions in charge of 
* executing a filter for possible hackers that want to attack our server. To do this functionality, the
* function serverProtect read the blacklist and the routes_enabled file. If the ip of the requests appear
* inside the blacklist or the hacker tries to acceed to another route, maybe with a different method of
* the defined inside the routes_enabled file, the server automatically rejects the request.
*/
const path = require('path');
const fs = require('fs');

const { createError, manageBadRequests } = require("../../utils/utils");

exports.serverProtect = (req, res, next) => {

	try {

		// Register the blaclist and the routes_enabled paths.
		const blacklist_path = path.join(__dirname, '..', '..', 'resources', 'blacklist.json');
		const routes_enabled_path = path.join(__dirname, '..', '..', 'resources', 'routes_enabled.json');

		// Create, if not exists, the blacklist file.
		if(!fs.existsSync(blacklist_path)) fs.writeFileSync(blacklist_path, JSON.stringify({ hacker_list: [], requests_list: [] }, null, 2));

		// Read and parse the two files data.
		const blacklist_raw = fs.readFileSync(blacklist_path);
		let blacklist = JSON.parse(blacklist_raw);

		const routes_enabled_raw = fs.readFileSync(routes_enabled_path);
		let routes_enabled = JSON.parse(routes_enabled_raw);

		// Extract the baseUrl of the request, without params and query params.
		let url_parts = req.originalUrl.split('/');
		let baseUrl = `/${url_parts[1]}/${url_parts[2]}`;
		baseUrl = baseUrl.split('?')[0];

		// If routes_enabled does not contain the route of the requests and its method, we reject the request.
		if(!routes_enabled.hasOwnProperty(baseUrl) || !routes_enabled[baseUrl].available_methods.includes(req.method)){
			manageBadRequests(req);
			throw createError(403, 'Forbidden because of security reasons');
		}

		// If ip of the request is in blacklist, we reject the request again.
		if(blacklist.hacker_list.includes(req.ip)) throw createError(403, 'Forbidden because of security reasons');

		next();

	} catch(err) { next(err); }

}