const express = require('express')
const router = express.Router()
const { addRating } = require('../sql/ratings')

router.post('', (req, res, next) => {
  addRating(req.body.photoId, req.body.rating, req.session.id)
    .then(() => res.json())
    .catch(error => next(error));
});

module.exports = router
