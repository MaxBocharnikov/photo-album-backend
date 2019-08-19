const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dir = './images'

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    try {
        fs.statSync(dir);
    } catch(e) {
        fs.mkdirSync(dir);
    }
    callback(null, dir)
  },
  filename: (req, file, callback) => {
    const fileName = `${file.fieldname}-${Date.now()}.${path.extname(file.originalname)}`
    callback(null, fileName)
  }
});


const upload = multer({ storage })
module.exports = upload
