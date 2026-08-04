const mongoose = require("mongoose");
const { isLowercase } = require("validator");

const emailOtpSchema = new mongoose.Schema({
    email:{
        type:String,
        lowercase:true,
        trim:true,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    },
    purpose: {
    type: String,
    enum: ["verify-email", "reset-password","change-email"],
    required: true
}
},{timestamps:true});

const emailOtpModel = mongoose.model("EmailOtp",emailOtpSchema);

module.exports = emailOtpModel;