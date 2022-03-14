const express = require('express');
const { initalData } = require('../../controller/admin/initaldata');
const router = express.Router()

router.post('/initaldata',initalData);

module.exports = router; 