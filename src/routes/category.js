const express = require('express');
const { requireSignin,adminMiddleware,userMiddleware } = require('../common-middleware');
const { addCategory, getCategory, updateCategory } = require('../controller/category');

const router = express.Router();


const multer = require('multer');
const shoriId = require('shortid')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname),'uploads'))
    },
    filename: function (req, file, cb) {
       cb(null, shoriId.generate() + '-' + file.originalname)
    }
  })

  const upload = multer({storage})

router.post('/category/create', requireSignin,adminMiddleware,upload.single('categoryImage'), addCategory)
router.get('/category/getcategory',getCategory)
router.post('/category/update',upload.array('categoryImage'), updateCategory)

module.exports = router;