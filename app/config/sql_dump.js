/*
* This file is executed in server.js in order to create a dump on database, filling it with 220 rows.
* The script ask for the 220th company on database, and if not exists, execute a loop that introduce
* them one by one, filling every row with some standar data as you can se below, inside company object.
*/
(() => {
	const db = require("../models");
	const Company = db.company;
	const Op = db.Sequelize.Op;
	const crypto = require('crypto');
  const constants = require("./constants");
  const utils = require("../utils/utils");

	Company.findAll({ where: { id: '220' } })
    .then(async (data) => {
      if(utils.isEmptyArray(data)){
      	for(let i=constants.sql_dump.MIN_TABLE_ID; i<constants.sql_dump.MAX_TABLE_ID; i++){
      		
          let company = {
      			name: `MyCompany${i}`,
      			description: `The best company of the world, ${i} times`,
      			email: `ceo@mycompany${i}.com`,
      			cif: `A${constants.sql_dump.THREE_DIGITS_EXAMPLE_NUMBER + i}12345`,
      			logo: `https://www.awesomeimage${i}.com`,
      			token: crypto.createHash('sha256').update(`MyCompany${i}` + `A${constants.sql_dump.THREE_DIGITS_EXAMPLE_NUMBER + i}12345` + new Date().getMilliseconds()).digest('hex')
      		}

      		await Company.create(company);
      	}
      }
    })
    .catch(err => {
      console.log(err);
    });
})();