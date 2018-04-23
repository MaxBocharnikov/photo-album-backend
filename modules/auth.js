const express = require('express')
const router = express.Router()
const {
  register,
  login
} = require('../sql/users')
const { insertToken } = require('../sql/tokens')

router.post('/register', function (req, res, next) {
  register(req.body.login, req.body.password, req.body.name)
    .then(() => login(req.body.login, req.body.password))
    .then(({ id }) => insertToken(id))
    .then(token => res.json(token))
    .catch(error => next(error));
});

router.post('/login', function (req, res, next) {
  login(req.body.login, req.body.password)
    .then(({ id }) => insertToken(id))
    .then(token => res.json(token))
    .catch(error => next(error));
});


module.exports = router