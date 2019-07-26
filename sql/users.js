var knex = require("./sqlConnectionOptions").knex;

function getUserById(userId) {
  return knex('users')
    .select('user_id as id', 'name')
    .where('user_id', userId)
    .then(users => {
      if (!users[0]) {
        return {
          user_id: 0,
          name: ''
        };
      } else {
        return users[0];
      }
    });
}

function getCurrentUser(userId) {
  return knex('users')
    .select('user_id as id', 'login', 'name')
    .where('user_id', userId)
    .then(users => {
      if (users.length === 0) {
        throw new Error ('No such user')
      }
    });
}

function checkLoginExistence(login) {
  return knex('users')
    .select('user_id as id', 'name', 'login')
    .where('login', login)
    //.andWhere('user_id', '<>', userId)
    .then(users => {
      if (users[0]) {
        return true;
      } else {
        return false;
      }
    });
}

function changeUser(userId, login, name) {
  return knex.raw(`update users set login = '${login}' , name='${name}' where user_id = ${userId};`);
}


function login(login, password) {
  return knex('users')
    .select('user_id as id', 'name', 'login')
    .where({ login, password })
    .then(users => {
      if (users.length === 0) {
        throw new Error('Login or password is incorrect')
      }
      return users[0];
    });
}

function register(login, password, name) {
  return knex('users')
    .select('user_id')
    .where({ login })
    .then(users => {
      if (users[0]) {
        throw new Error('Login is already in use')
      }
      return knex('users')
        .insert({ login, name, password })
    });
}

module.exports = {
  changeUser,
  checkLoginExistence,
  getUserById,
  getCurrentUser,
  login,
  register
}
