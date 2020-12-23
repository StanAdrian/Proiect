'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkInsert(
        'Projects',
        [
          { id: 1, repo_url: 'https://github.com/aaa' },
          { id: 2, repo_url: 'https://github.com/bbb' },
        ],
        {}
      )
      .catch((error) => console.log(error))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Projects', null, {})
  },
}
