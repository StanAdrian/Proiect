'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProject extends Model {
    static associate(models) {
      // define association here
    }
  };
  UserProject.init({
    projectId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserProject',
  });
  return UserProject;
};