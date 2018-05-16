const express = require('express')
const router = express.Router()
const { addRating } = require('../sql/ratings')
const authorize = require('../middlewares/authorize')

router.post('', authorize, (req, res, next) => {
  addRating(req.body.photoId, req.body.rating, req.currentUser.id)
    .then(() => res.json())
    .catch(error => next(error));
});

module.exports = router
