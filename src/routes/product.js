const express = require('express');
const { requireSignin, adminMiddleware } = require('../common-middleware');
const { createProduct, getProductBySlug, getProductDetailsById, getAllProductAap } = require('../controller/product');

const multer = require('multer');
const shoriId = require('shortid')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, shoriId.generate() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

const router = express.Router();

router.post('/product/create', requireSignin, adminMiddleware, upload.array('productPictures'), createProduct);
router.get('/product/:slug', getProductBySlug);
router.post('/product/:productId', getProductDetailsById);

router.get('/getAllProductAap', getAllProductAap)



module.exports = router;