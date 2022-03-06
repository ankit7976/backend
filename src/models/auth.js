const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        trim:true,
        required:true,
        min:2,
        max:20
    },

    lastName: {
        type:String,
        trim:true,
        required:true,
        min:2,
        max:20
    },

    userName: {
        type:String,
        required:true,
        unique:true,
        
    },

    email: {
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },

    hash_password : {
        type:String,
        required:true
    },
    role : {
        type:String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    contactNumber : {type:String},
    pofilePicture : {type:String}

},{timestamps:true});

userSchema.virtual('password')
.set(function(password){
   return this.hash_password = bcrypt.hashSync(password,10)
})
userSchema.methods = {
    authenticate: function(password){
        return bcrypt.compareSync(password, this.hash_password)
    }
}


 userSchema.virtual('fullName')
 .get(function(){
     return `${this.firstName} ${this.lastName}`
 });



module.exports = mongoose.model('User',userSchema)