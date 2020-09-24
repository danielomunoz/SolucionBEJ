/*
* This is the model of Favorite table on database.
*/
module.exports = (sequelize, Sequelize) => {
  const Favorites = sequelize.define("Favorites", {
    ownerId: {
      type: Sequelize.INTEGER(255),
      allowNull: false
    },
    companyId: {
      type: Sequelize.INTEGER(255),
      references: {
        model: 'Companies',
        key: 'id'
      }
    }
  });

  return Favorites;
};