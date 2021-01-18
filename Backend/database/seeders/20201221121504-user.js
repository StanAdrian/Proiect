'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkInsert(
        'Users',
        [
          {
            id: 1,
            email: 'test@gmail.com',
            password: 'user',
          },
          {
            id: 2,
            email: 'test1@gmail.com',
            password: 'user',
          },
        ],
        {}
      )
      .catch((error) => console.log(error))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  },
}
