const express = require('express')
const router = express.Router()
const { register, login, getCurrentUser } = require('../sql/users')
const { insertToken } = require('../sql/tokens')
const authorize = require('../middlewares/authorize')

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

router.get('/current-user', authorize, (req, res, next) => {
  res.json({ user: req.currentUser })
});

module.exports = router