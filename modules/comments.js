const express = require('express')
const router = express.Router()

router.post('', function (req, res, next) {
  addComment(req.body.postId, req.session.id, req.body.text)
    .then((id) => res.json(id))
    .catch(error => next(error));
});

router.put('', function (req, res, next) {
  changeComment(req.body.id, req.body.text)
    .then(() => res.json())
    .catch(error => next(error));
});

router.delete('/deleteCommentById', function (req, res, next) {
  deleteCommentById(req.body.id)
    .then(() => res.json())
    .catch(error => next(error));
});

router.get('/getCommentsByPhotoId/:photoId', function (req, res, next) {
  getCommentsByPhotoId(req.params.photoId)
    .then(comments => res.json({ comments }))
    .catch(error => next(error));
});

module.exports = router
