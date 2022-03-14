const User = require('../models/auth')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

exports.signup = (req,res) => {
    User.findOne({email:req.body.email}).exec( async (error,user)=>{
        if(user) return res.status(400).json({message:'email is already registerd'});

        const {firstName,lastName,email,password} = req.body;

        const hash_password = await bcrypt.hash(password,10)
        const _user = new User({
            firstName,lastName,email,hash_password,userName: Math.random()
        });
    
        _user.save((error,data)=>{
            if(error) return res.status(400).json({message:'Somthing went wrong'})
            if(data) return res.status(201).json({message:'user created sucessfuly'})
    
        })

    })
   

}


exports.signin = (req,res)=>{
    User.findOne({email:req.body.email})
    .exec((error,user)=>{
        if(error) res.status(400).json({error})
        if(user){
            if(user.authenticate(req.body.password)){

                const token = jwt.sign({_id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn: '1h'})
                const {firstName,lastName,email,role,fullName} = user
                res.status(200).json({
                    token,
                    user: {
                        firstName,lastName,email,role,fullName
                    }
                })
            }else{
                res.status(400).json({
                    message:"invalid Password"
                })
            }


        }else{
            res.status(400).json({
                message:"somthing went wrong...."
            })
        }
    })
}

