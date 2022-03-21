const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-middleware');
const { initalData } = require('../../controller/admin/initaldata');
const router = express.Router()

router.post('/initaldata', requireSignin,adminMiddleware,initalData);

module.exports = router; 