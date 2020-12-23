'use strict'

const { User, Project } = require('../models')

class UsersRepository {
  constructor() {
    this.includeProjects = {
      model: Project,
      as: 'projects',
      attributes: ['repoUrl'],
      through: { attributes: ['role'] },
    }
    this.attributes = {
      exclude: ['password'],
    }
  }

  findAll() {
    return User.findAll({
      include: [this.includeProjects],
      attributes: this.attributes,
    })
  }

  findById(id) {
    return User.findByPk(id, {
      include: [this.includeProjects],
      attributes: this.attributes,
    })
  }

  findOne(email) {
    return User.findOne({
      where: { email },
      include: [this.includeProjects],
    })
  }

  save(user) {
    return User.build(user).save()
  }

  exists(id) {
    return User.count({
      where: { id },
    }).then((count) => !!(count > 0))
  }
}

module.exports = new UsersRepository()
