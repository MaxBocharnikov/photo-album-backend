var knex = require("./sqlConnectionOptions").knex;
const uuid = require('uuid');

const insertToken = userId => {
  const token = uuid.v1()
  return knex('tokens')
    .insert({ id: token, user_id: userId })
    .then(() => ({ token }))
}

module.exports = {
  insertToken
}
