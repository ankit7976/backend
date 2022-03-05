const mongoose = require('mongoose');
const bycrpt = require('bcrypt')

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
        default: 'admin'
    },
    contactNumber : {type:String},
    pofilePicture : {type:String}

},{timestamps:true});

userSchema.virtual('password')
.set(function(password){
    this.hash_password = bycrpt.hashSync(password,10)
});

// userSchema.virtual('fullName')
// .get(function(){
//     return `${this.firstName} ${this.lastName}`
// });

userSchema.method = {
    authenticate: function(password){
        return bycrpt.compareSync(password, this.hash_password)
    }
}


module.exports = mongoose.model('User',userSchema)