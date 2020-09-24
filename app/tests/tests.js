/*
* A bunch of visual tests to check that code is not broke every time that I introduce important changes.
* To simplify, I only included only the well-formeds requests, but this script could be completed with
* some bad requests and with non-visual data, simulating the mocha and chai test packages.
*/
(async () => {
	const fetch = require('node-fetch');
	const db = require("../models");
	const Company = db.company;
  	const cnsts = require("../config/constants");

  	// Create do_fetch function that simplifies a lot the fetching task.
	const do_fetch = (url, method, body, headers) => {
		return new Promise((res, rej) => {
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
		    .then(json => res(json))
		    .catch(err => rej(err));
		});
	}

	// I will create the body of the requests if corresponds, and fetch my own server with a well-formed
	// petition. Then I will console.log the result.
	let body = {
	    name: "La última empresa registrada",
	    description: "La mejor de todo el mundo, esta vez sí",
	    email: "ceo@ultimatecompany.com",
	    cif: "E12345678",
	    logo: "http://www.trueawesomeimage.com"
	};

	let result = await do_fetch('http://127.0.0.1:3000/api/companies', 'post', body, { 'Content-Type': 'application/json' });
 	console.log('CREATING A COMPANY => ', result);

 	// I look for a random company to extract its token because I need it for futures requests of this script.
 	let myCompanyObject = await Company.findAll({ where: { id: '222' } });
 	let token = myCompanyObject[0].dataValues.token;

 	body = {
	    name: "La última empresa registrada y actualizada",
	    description: "La mejor de todo el mundo, actualizada",
	    shortdesc: "Sabemos de gatos",
	    ccc: "ES1234 45 4878 6564 4556",
	    status: true 
	};

 	result = await do_fetch('http://127.0.0.1:3000/api/companies/222', 'put', body, { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
	console.log('UPDATING A COMPANY => ', result);

	result = await do_fetch('http://127.0.0.1:3000/api/companies?page=1', 'get', null, { 'Authorization': `Bearer ${token}`})
	console.log('LISTING SOME COMPANIES => ', result);

	result = await do_fetch('http://127.0.0.1:3000/api/companies/mun', 'get', null, null);
	console.log('SEARCHING COMPANY BY PATTERN => ', result);

	result = await do_fetch('http://127.0.0.1:3000/api/owners?page=1&limit=40', 'get', null, { 'Authorization': `Bearer ${cnsts.controllers.shared.AUTH_TOKEN}`});
	console.log('LISTING SOME OWNERS => ', result);

	result = await do_fetch('http://127.0.0.1:3000/api/owners/1', 'get', null, { 'Authorization': `Bearer ${cnsts.controllers.shared.AUTH_TOKEN}`});
	console.log('GET FIRST OWNER INFO => ', result);

	body = { ownerId: "25", companyId: "221" };
	result = await do_fetch('http://127.0.0.1:3000/api/favorites', 'post', body, { 'Content-Type': 'application/json' });
	console.log('CREATING FAVORITE RELATIONSHIP => ', result);
})();