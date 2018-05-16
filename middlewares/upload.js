const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './images')
  },
  filename: (req, file, callback) => {
    const fileName = `${file.fieldname}-${Date.now()}.${path.extname(file.originalname)}`
    callback(null, fileName)
  }
});

const upload = multer({ storage })

module.exports = upload
