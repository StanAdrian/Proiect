'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkInsert(
        'Bugs',
        [
          {
            id: 1,
            assignedUserId: 1,
            severity: 1,
            priority: 1,
            description: 'Bug bla bla',
            commitUrl: 'https://github.com/aaa',
            projectId: 1,
            registeringUserId: 2,
            status: 'CREATED',
          },
        ],
        {}
      )
      .catch((error) => console.log(error))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Bugs', null, {})
  },
}
