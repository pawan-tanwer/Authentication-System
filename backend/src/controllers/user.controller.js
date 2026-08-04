const bcrypt = require("bcrypt")
const userModel = require("../models/user.js");
const refreshTokenModel = require("../models/RefreshToken.js");
const uploadToCloudinary = require("../utils/uploadToCloudinary.js");
const deleteFromCloudinary = require("../utils/deleteFromCloudinary.js");
const emailOtpModel = require("../models/Emailotp.js");
const validator = require("validator");
const transporter = require("../config/email.js");

const updateUserRole = async(req,res)=>{
    try {
        const {id} = req.params;
        const{role} = req.body;

        if(!["user","admin"].includes(role)){
            return res.status(400).json({
                success:false,
                message:"Invalid role"
            })
        }

        const user = await userModel.findById(id);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        if(req.user._id.toString()=== user._id.toString()){
            return res.status(400).json({
                success:false,
                message:"You cannot change your own role"
            })
        }
        user.role = role;
        await user.save();

        return res.status(200).json({
            success:true,
            message:"User role updated successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
const getAllUser = async(req,res)=>{
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page-1)*limit;

        const user = await userModel.find({})
        .select("name email isEmailVerified createdAt isBlocked avatar.url")
        .skip(skip)
        .limit(limit);

        const totalUsers = await userModel.countDocuments();
        const activeUsers = await userModel.countDocuments({ isBlocked: false });
        const blockedUsers = await userModel.countDocuments({ isBlocked: true });
        const totalAdmins = await userModel.countDocuments({ role: "admin" });
        const totalPages = Math.ceil(totalUsers/limit);

        return res.status(200).json({
            success:true,
            currentPage:page,
            totalPages,
            totalUsers,
            activeUsers,
            blockedUsers,
            totalAdmins,
            user,
        })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
const getMyProfile = async(req,res)=>{
    try {
        return res.status(200).json({
            success:true,
            user:req.user
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
const updateProfile = async (req, res) => {
    try {
        const allowedFields =[
            "name",
            "username",
            "phone",
            "bio"
        ]
        const updateData ={};
        allowedFields.forEach((field)=>{
            if(req.body[field] !== undefined){
                updateData[field]=req.body[field];
            }
        })

        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            updateData,
            {
                new:true,
                runValidators:true
            }
        ).select("-password -refreshToken");

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update.",
            });
        }   

        return res.status(200).json({
            success:true,
            message:"profile updated successfully",
            user:updatedUser
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
};
const changePassword = async(req,res)=>{
    try {
        const{currentPassword,newPassword,confirmPassword}=req.body;
        if(!currentPassword || !newPassword ||!confirmPassword){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        if(newPassword.length<8){
            return res.status(400).json({
                success:false,
                message:"Password must be 8 character long"
            })
        }
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"confirm password is not matching"
            })
        }
        if(currentPassword === newPassword){
            return res.status(400).json({
                success:false,
                message:"New password must be different from current password"
            })
        }

        const user = await userModel.findById(req.user._id).select("+password");

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Current Password is incorrect"
            })
        }

        const hashPassword = await bcrypt.hash(newPassword,10);
        user.password = hashPassword;
        await user.save();

        await refreshTokenModel.deleteMany({
            user:user._id
        });

        return res.status(200).json({
            success:true,
            message:"Password change successfully. Please login again"
        })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
const updateAvatar = async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({
                success:false,
                message:"Avatar is required"
            })
        }
        const user = await userModel.findById(req.user._id);
        const oldPublicId = user.avatar?.publicId;

        const result = await uploadToCloudinary(req.file.buffer);
        
        if(oldPublicId){
            await deleteFromCloudinary(oldPublicId)
        }
        user.avatar={
            url:result.secure_url,
            publicId:result.public_id
        }

        await user.save();
        return res.status(200).json({
            success:true,
            message:"Photo updated successfully",
            avatar:user.avatar
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
const changeEmail = async(req,res)=>{
    try {
        const {newEmail} = req.body;
        if(!newEmail){
            return res.status(400).json({
                success:false,
                message:"New email is required"
            })
        }
        if(!validator.isEmail(newEmail)){
            return res.status(400).json({
                success:false,
                message:"Invalid email format"
            })
        }
        if(req.user.email === newEmail){
            return res.status(400).json({
                success:false,
                message:"New email must be different from current email"
            })
        }
        const isEmailExist = await userModel.findOne({newEmail});
        if(isEmailExist){
            return res.status(400).json({
                success:false,
                message:"Email already exist"
            })
        }
        await emailOtpModel.deleteMany({
            email: newEmail,
            purpose: "change-email"
        });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await emailOtpModel.create({
            email:newEmail,
            otp,
            purpose:"change-email",
            expiresAt:new Date(Date.now()+10*60*1000)
        })

        res.status(200).json({
            success:true,
            message:"OTP sent successfully "
        })

        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:newEmail,
            subject:"Email Verification OTP",
            html:`
            <h2>Email-Change Verification</h2>
            <p>Your OTP is:</p> 
            <h1>${otp}</h1>
            <p>This OTP is vaild for 5 minutes.</p>
            `
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
const verifyEmailChange = async(req,res)=>{
    try {
        const {newEmail,otp} = req.body;
        if(!newEmail || !otp){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const newUserExist = await userModel.findOne({email:newEmail});
        if(newUserExist){
            return res.status(401).json({
                success:false,
                message:"This already exist. You can login with this email."
            })
        }
        const emailOtp = await emailOtpModel.findOne({
            email:newEmail,
            purpose:"change-email"
        })

        if(!emailOtp){
            return res.status(404).json({
                success:false,
                message:"OTP not found"
            })
        }

        if(new Date() > emailOtp.expiresAt){
            await  emailOtpModel.deleteOne({
                _id:emailOtp._id
            })
            return res.status(400).json({
                success:false,
                message:"OTP expires"
            })
        }
        if(emailOtp.otp !== otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }
        const user = await userModel.findById(req.user._id);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        user.email = newEmail;
        user.isEmailVerified = true;

        await user.save();

        await emailOtpModel.deleteOne({
            _id:emailOtp._id
        })

        return res.status(200).json({
            success:true,
            message:"Email Changed successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
const blockOrUnblockUser =async(req,res)=>{
    try {
        const {id} = req.params;
        const {isBlocked} = req.body;
        if( typeof isBlocked !== "boolean"){
            return res.status(400).json({
                success:false,
                message:"isBlocked must be true or false"
            })
        }
        if(req.user._id.toString() === id){
            return res.status(400).json({
                success:false,
                message:"You cannot block your own account"
            })
        }
        const user = await userModel.findById(id);
            if(!user){
                return res.status(400).json({
                    success:false,
                    message:"User not found"
                })
            }

        user.isBlocked = isBlocked;
        await user.save();

        return res.status(200).json({
            success:true,
            message: isBlocked ?"User blocked successfully"
            :"User Unblocked successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
module.exports={
    updateUserRole,
    getAllUser,
    getMyProfile,
    updateProfile,
    changePassword,
    updateAvatar,
    changeEmail,
    verifyEmailChange,
    blockOrUnblockUser
}