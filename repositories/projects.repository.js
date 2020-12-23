'use strict'

const { User, Project } = require('../models')

class ProjectsRepository {
  constructor() {
    this.includeUsers = {
      model: User,
      as: 'users',
      attributes: ['email', 'id'],
      through: { attributes: ['role'] },
    }
  }

  findAll() {
    return Project.findAll({
      include: [this.includeUsers],
    })
  }

  findById(id) {
    return Project.findByPk(id, {
      include: [this.includeUsers],
    })
  }

  isAlreadyMember(project, userId) {
    return !!project.users.find(({ dataValues: { id } }) => id === userId)
  }

  getUserRole(projectId, userId) {
    return this.findById(projectId).then(
      (project) =>
        project?.users.find(({ dataValues: { id } }) => id === userId)?.dataValues.UserProject.dataValues.role
    )
  }

  save(project) {
    return Project.build(project).save()
  }

  exists(id) {
    return Project.count({
      where: { id },
    }).then((count) => !!(count > 0))
  }
}

module.exports = new ProjectsRepository()
