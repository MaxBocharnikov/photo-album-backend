const express = require('express')
const router = express.Router()
const { addLike, isLiked, removeLike } = require('../sql/likes')
const upload = require('../middlewares/upload')
const authorize = require('../middlewares/authorize')


router.post('', authorize, (req, res, next) => {
    addLike(req.body.photoId, req.currentUser.id)
.then(likes => res.json(likes))
.catch(error => next(error))
});


router.delete('/:photoId', authorize, (req, res, next) => {
    removeLike(req.params.photoId, req.currentUser.id)
.then(() => res.json());
});

router.get('/isLiked/:photoId', authorize, (req, res, next) => {
    isLiked(req.params.photoId, req.currentUser.id)
.then(likes => res.json(likes))
.catch(error => next(error))
});



module.exports = router