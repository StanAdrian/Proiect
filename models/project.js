'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsToMany(models.User, {
        through: 'UserProject',
        as: 'users',
        foreignKey: 'projectId',
      })
    }
  }
  Project.init(
    {
      repoUrl: {
        type: DataTypes.STRING,
        field: 'repo_url',
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Project',
    }
  )
  return Project
}
