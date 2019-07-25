const express = require('express')
const router = express.Router()
const { addComment, changeComment, deleteCommentById, getCommentsByPhotoId, getCommentById } = require('../sql/comments')
const authorize = require('../middlewares/authorize')
router.post('', authorize, function (req, res, next) {
  addComment(req.body.postId, req.currentUser.id, req.body.text)
    .then((id) => res.json(id))
    .catch(error => next(error));
});

router.put('', authorize, function (req, res, next) {
  changeComment(req.body.commentId, req.body.text)
    .then((comment) => res.json(comment))
    .catch(error => next(error));
});

router.delete('/deleteCommentById/:commentId', authorize, function (req, res, next) {
  deleteCommentById(req.params.commentId)
    .then(() => res.json())
    .catch(error => next(error));
});

router.get('/getCommentsByPhotoId/:photoId', /*authorize,*/ function (req, res, next) {
  getCommentsByPhotoId(req.params.photoId)
    .then(comments => res.json({ comments }))
    .catch(error => next(error));
});

router.get('/getCommentById/:commentId', /*authorize,*/ function(req, res,next){
  getCommentById(req.params.commentId)
  .then(comment => res.json({ comment }))
  .catch(error => next(error));
});

module.exports = router
