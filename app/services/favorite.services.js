/*
* This is the corresponding service files of Favorite controller. Here, we define the 'do_fetch' function,
* that executes a complete fetch for us instead of include that little mess inside the exported services.
* The Favorite controller only uses the 'getOwner' service, that requests some owner info to the /users api.
*/

// Importing external and core packages.
const fetch = require('node-fetch');

// Importing own modules.
const cnsts = require("../config/constants");

exports.getOwner = async (ownerId) => {
	let owner_info = await do_fetch(cnsts.controllers.shared.API_USERS_BASE_URL + `/${ownerId}`, 'get', null, { Authorization: cnsts.controllers.shared.AUTH_TOKEN});

	return owner_info;
}

const do_fetch = (url, method, body, headers) => {
	return new Promise((resolve, reject) => {
		let options = {};
		if(method == 'get'){
			options.method = method;
			options.headers = headers;
		} else {
			options.method = method;
			options.body = JSON.stringify(body);
			options.headers = headers;
		}
		fetch(url, options)
	    .then(res => res.json())
	    .then(json => resolve(json))
	    .catch(err => reject(err));
	});
}