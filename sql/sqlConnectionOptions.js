var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'gerasimumu',
    database: 'photo_album'
  }
});

exports.knex = knex;