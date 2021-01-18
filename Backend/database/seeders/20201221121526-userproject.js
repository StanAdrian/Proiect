'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkInsert(
        'UserProjects',
        [
          { id: 1, projectId: 1, userId: 1, role: 'MP' },
          { id: 2, projectId: 1, userId: 2, role: 'TESTER' },
        ],
        {}
      )
      .catch((error) => console.log(error))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserProjects', null, {})
  },
}
