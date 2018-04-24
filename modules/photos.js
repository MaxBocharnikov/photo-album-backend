const express = require('express')
const router = express.Router()
const { addPhoto, changePhoto, getUserPhotos, getAllPhotos } = require('../sql/photos')
const upload = require('../middlewares/upload')
const authorize = require('../middlewares/authorize')

router.post('', authorize, upload.single('file'), (req, res, next) => {
  addPhoto(req.currentUser.id, 'http://localhost:3000/' + req.file.filename, req.body.title, req.body.description)
    .then(photo => res.json(photo))
    .catch(error => next(error))
});

router.put('/:photoId', authorize, (req, res, next) => {
  changePhoto(req.body.id, req.body.title, req.body.description, req.currentUser.id)
    .then(photo => res.json(photo))
    .catch(error => next(error))
});

router.delete('/:photoId', authorize, (req, res, next) => {
  deletePhotoById(req.params.photoId, req.currentUser.id)
    .then(() => res.json());
});

router.get('/getUserPhotos', authorize, (req, res, next) => {
  getUserPhotos(req.currentUser.id)
    .then(photos => res.json(photos))
    .catch(error => next(error))
});

router.get('/getAllPhotos', authorize, (req, res, next) => {
  getAllPhotos(req.currentUser.id)
    .then(photos => res.json(photos))
    .catch(error => next(error))
});

module.exports = router
