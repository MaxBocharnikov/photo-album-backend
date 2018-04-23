const connection = require('../connection.json')

const knex = require('knex')({
  client: 'mysql',
  connection
});

exports.knex = knex;