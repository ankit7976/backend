const express = require('express')
const { requireSignin } = require('../../common-middleware')
const {signup,signin,signout} = require('../../controller/admin/auth')
const { validateSignupRequest,validateSigninRequest, isRequestValidated } = require('../../validator/auth')
const router = express.Router()


    

router.post('/admin/signup', validateSignupRequest, isRequestValidated,signup);
router.post('/admin/signin',validateSigninRequest, isRequestValidated,signin);
router.post('/admin/signout',signout);
router.get('/admin/profile', requireSignin,(req,res)=>{
    res.status(201).json({user:'user'})
})
module.exports = router; 