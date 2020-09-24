/*
* This is the model of Company table on database.
*/
module.exports = (sequelize, Sequelize) => {
  const Companies = sequelize.define("Companies", {
    name: {
      type: Sequelize.STRING(100),
      unique: true
    },
    cif: {
      type: Sequelize.STRING(9),
      unique: true
    },
    shortdesc: {
      type: Sequelize.STRING(100)
    },
    description: {
      type: Sequelize.TEXT
    },
    email: {
      type: Sequelize.STRING(100)
    },
    ccc: {
      type: Sequelize.STRING(100)
    },
    date: {
      type: Sequelize.DATE
    },
    status: {
      type: Sequelize.BOOLEAN
    },
    logo: {
      type: Sequelize.TEXT
    },
    token: {
      type: Sequelize.STRING(64),
      unique: true
    }
  });

  return Companies;
};