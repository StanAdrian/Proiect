'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bug extends Model {

  };
  Bug.init({
    assignedUserId: DataTypes.INTEGER,
    severity: DataTypes.INTEGER,
    priority: DataTypes.INTEGER,
    description: DataTypes.STRING,
    commitUrl: DataTypes.STRING,
    projectId: DataTypes.INTEGER,
    registeringUserId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    solveCommitUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bug',
  });
  return Bug;
};