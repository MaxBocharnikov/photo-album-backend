const express = require('express')
const router = express.Router()
const { addPhoto, changePhoto, getUserPhotos, getAllPhotos } = require('../sql/photos')
const upload = require('../middlewares/upload')

router.post('', upload.single('file'), (req, res, next) => {
  addPhoto(req.session.id, 'http://localhost:3000/' + req.file.filename, req.body.title, req.body.description)
    .then(photo => res.json(photo))
    .catch(error => next(error))
});

router.put('/:photoId', (req, res, next) => {
  changePhoto(req.body.id, req.body.title, req.body.description, req.session.id)
    .then(photo => res.json(photo))
    .catch(error => next(error))
});

router.delete('/:photoId', (req, res, next) => {
  deletePhotoById(req.params.photoId, req.session.id)
    .then(() => {
      res.send();
      res.end();
    });
});

router.get('/getUserPhotos', (req, res, next) => {
  getUserPhotos(req.session.id)
    .then(photos => {
      res.send(photos);
      res.end();
    });
});

router.get('/getAllPhotos', (req, res, next) => {
  getAllPhotos(req.session.id)
    .then(photos => {
      res.send(photos);
      res.end();
    });
});

module.exports = router
