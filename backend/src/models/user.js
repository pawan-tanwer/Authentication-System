const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,    
        unique:true,
        sparse:true,
        lowercase:true,
        trim:true,
        index:true
    },
    phone:{
        type:String,
        unique:true,
        sparse:true,
        index:true
    },
    password:{
        type:String,
        select:false
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },  
    avatar: {
    url: {
        type: String,
        default:"http://localhost:8000/profile.png"
    },
    publicId: {
        type: String,
        default: null
    }
    },
    provider:{
        type:String,
        enum:["local","google","github","phone"],
        default:"local"
    },
    providerId: {
      type: String,
      default: null,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
},{timestamps:true})

const userModel = mongoose.model("User",userSchema);

module.exports = userModel;