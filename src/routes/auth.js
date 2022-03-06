const express = require('express')
const { requireSignin } = require('../common-middleware')
const {signup,signin} = require('../controller/auth')
const { validateSignupRequest,validateSigninRequest, isRequestValidated } = require('../validator/auth')
const router = express.Router()


    

router.post('/signup',validateSignupRequest, isRequestValidated,signup)

router.post('/signin',validateSigninRequest, isRequestValidated,signin)
router.post('/profile', requireSignin,(req,res)=>{
    res.status(201).json({user:'user'})
})
module.exports = router; 