const userModel = require("../models/user.js");
const emailOtpModel = require("../models/Emailotp.js");
const refreshTokenModel = require("../models/RefreshToken.js")

const bcrypt = require("bcrypt");
const validator = require("validator");

const transporter = require("../config/email.js");
const {generateAccessToken,generateRefreshToken, verifyRefreshToken,
    generateResetToken,verifyResetToken} = require("../utils/jwt.js");

const googleClient = require("../utils/google");

const register = async(req,res)=>{
    try {
        const {name,email,password} = req.body;
    
    //check required fields
    if(!name || !email || !password){
        return res.status(400).json({
            success:false,
            message:"all fields required"
        })
    }

    //email format verify
    if(!validator.isEmail(email)){
        return res.status(400).json({
            success:false,
            message:"Invalid Email Format"
        })
    }

    //password validate
    if(password.length<8){
        return res.status(400).json({
            success:false,
            message:"Password must be 8 Character long"
        })
    }
    //checking user exist with this email or not
    const isUserExist = await userModel.findOne({email});
    if(isUserExist){
        return res.status(409).json({
            success:false,
            message:"Email already registered"
        })
    }
    // hashing the password
    const saltRound = 10;
    const hashPassword = await bcrypt.hash(password,saltRound);

    // storeing in database
    const user = await userModel.create({
        name,
        email,
        password:hashPassword,
        isEmailVerified:false
    })
    
    // verifying email with otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await emailOtpModel.deleteMany({email,purpose:"verify-email"});

    const otpExpiry = new Date(Date.now()+ 5*60*1000);
    await emailOtpModel.create({
        email,
        otp,
        expiresAt:otpExpiry,
        purpose:"verify-email"
    })

    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:email,
        subject:"Email Verification OTP",
        html:`
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is vaild for 5 minutes.</p>
        `
    })
    return res.status(201).json({
        success:true,
        message:"OTP sent successfully.Please verify your email"    
    })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
const verifyEmailOtp = async(req,res)=>{
try {
    const {email,otp} = req.body;

    if(!email || !otp){
        return res.status(400).json({
            success:false,
            message:"Email and OTP is required"
        })
    }

    const otpRecord = await emailOtpModel.findOne({email});
    // checking otp found or not
    if(!otpRecord){
        return res.status(400).json({
            success:false,
            message:"OTP not found"
        })
    }
    // otp expiry check
    if(new Date()>otpRecord.expiresAt){
        return res.status(400).json({
            success:false,
            message:"OTP has expired"
        })
    }
    //otp compare
    if(otpRecord.otp !== otp){
        return res.status(400).json({
            success:false,
            message:"Invalid OTP"
        })
    }
    // find user for registration complete
    const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({
            success:false,
            message:"User Not Found"
        })
    }

    user.isEmailVerified = true;
    await user.save();

    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    await refreshTokenModel.create({
        user:user._id,
        token:refreshToken,
        expiresAt:new Date(Date.now()+30*24*60*60*1000)
    })

    res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    await emailOtpModel.deleteOne({email});

    return res.status(200).json({
        success:true,
        message:"Email Verified Successfully",
        accessToken,
        userData:{
            name:user.name,
            avatar:user.avatar.url,
            email:user.email,
            role:user.role,
            date:user.createdAt,
            verified:user.isEmailVerified
        }
    })
    
} catch (error) {
    console.error("Error in verifyEmailOtp:", error);
    return res.status(500).json({
        success:false,
        message: error.message
    })
}
}
const login = async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Email and Password is required"
            })
        }    

        if(!validator.isEmail(email)){
            return res.status(400).json({
                success:false,
                message:"Invalid email address"
            })
        }

        const user = await userModel.findOne({email}).select("+password")
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid email or password"
            })
        }

        if(!user.isEmailVerified){
            return res.status(403).json({
                message:"Please verify your email first"
            })
        }
         
        const isPasswordMatch= await bcrypt.compare(password,user.password);

        if(!isPasswordMatch){
            return res.status(401).json({
                message:"Invalid email or password"
            })
        }

        // check user is block or not if user then don't allow login

        if(user.isBlocked){
            return res.status(403).json({
                success:false,
                message:"Your Account has been blocked"
            })
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id)

        await refreshTokenModel.create({
            user:user._id,
            token:refreshToken,
            expiresAt:new Date(Date.now()+30*24*60*60*1000)
        })

        res.cookie("refreshToken",refreshToken,
            {
                httpOnly:true,
                secure:false,
                sameSite:"lax",
                maxAge:30*24*60*60*1000
            }
        )
        return res.status(200).json({
            success:true,
            message:"Login Successful",
            accessToken,
            userData:{
            name:user.name,
            avatar:user.avatar.url,
            email:user.email,
            role:user.role,
            date:user.createdAt,
            verified:user.isEmailVerified
        }
        })
    } catch (error) {
        
    }
}
const refreshToken = async(req,res)=>{
    try {
        const token=req.cookies.refreshToken;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Refresh-Token not found"
            })
        }
        const decoded = verifyRefreshToken(token)
         
        const storeToken = await refreshTokenModel.findOne({token});
        if(!storeToken){
            return res.status(401).json({
                success:false,
                message:"Invalid Refresh Token"
            })
        }

        const user = await userModel.findById(decoded.userId);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }
        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Your account has been blocked"
            });
        }
        const accessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);
        await refreshTokenModel.deleteOne({token});

        await refreshTokenModel.create({
            user:user._id,
            token:newRefreshToken,
            expiresAt:new Date(Date.now()+30*24*60*60*1000)
        })
        
        res.cookie("refreshToken",newRefreshToken,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge:30*24*60*60*1000
        })
        return res.status(200).json({
            success:true,
            message:"Access-Token generated successfully",
            accessToken,
            userData:{
            name:user.name,
            avatar:user.avatar.url,
            email:user.email,
            role:user.role,
            date:user.createdAt,
            verified:user.isEmailVerified
        }
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
const logout = async(req,res)=>{
    try {
        const token = req.cookies.refreshToken;
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Refresh-Token Not Found"
        })
    }

    await refreshTokenModel.deleteOne({token});
    res.clearCookie("refreshToken")
    return res.status(200).json({
        success:true,
        
        message:"Logged out successfully"
    })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
const logoutAllDevices = async(req,res)=>{
    try {
        const token = req.cookies.resfreshToken;
        if(!token){
            return res.status(200).json({
                success:true,
                message:"logged out from all devices successfully"
            })
        }
        const decoded = await verifyRefreshToken(token);
        
        await refreshTokenModel.deleteMany({
            user:decoded.userId
        })
        res.clearCookie("refreshToken");
        return res.status(200).json({
            success:true,
            message:"Successfully logout from all devices"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
const forgotPassword = async(req,res)=>{
    try {
        const {email} = req.body;
        if(!email){
            return res.status(400).json({
                success:false,
                message:"Email is required"
            })
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({
                success:false,
                message:"Invalid email address"
            })
        }
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        if(!user.isEmailVerified){
            return res.status(403).json({
                success:false,
                message:"Please verify your email"
            })
        }
        const otp = Math.floor(100000+Math.random()*900000).toString();
        await emailOtpModel.deleteMany({
            email,
            purpose:"reset-password"
        })
        const otpExpiry = new Date(Date.now() +5*60*1000);
        await emailOtpModel.create({
            email,
            otp,
            expiresAt:otpExpiry,
            purpose:"reset-password"
        })
        
         res.status(200).json({
            success:true,
            message:"Password reset otp sent successfully"
        })

        await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Password OTP",
        html: `
        <h2>Reset Password</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
         `,
        });
    
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
const verifyResetOtp = async(req,res)=>{
    try {
        const {email,otp} = req.body;
        if(!email || !otp){
            return res.status(400).josn({
                success:false,
                message:"Email and OTP are required"
            })
        }
        const otpRecord = await emailOtpModel.findOne({
            email,
            purpose:"reset-password"
        })      
        if(!otpRecord){
            return res.status(404).json({
                success:false,
                message:"OTP not found"
            })
        }
        if(new Date()>otpRecord.expiresAt){
            return res.status(400).json({
                success:false,
                message:"OTP is expired"
            })
        }
        if(otpRecord.otp != otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        await emailOtpModel.deleteOne({
            email,
            purpose:"reset-password"
        })
        const user = await userModel.findOne({email})
        const resetToken = generateResetToken(user._id);
        return res.status(200).json({
            success:true,
            message:"OTP verified successfully",
            resetToken
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
const resetPassword = async(req,res)=>{
    try {
        console.log("jknjvanf j dwn aejdc,X");
        const {resetToken,newPassword,confirmPassword} = req.body;
        console.log("resetToken:", resetToken);
        if(!resetToken || !newPassword || !confirmPassword){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Confirm Password do not match"
            })
        }
        const decoded = verifyResetToken(resetToken);
        console.log("decoded:", decoded);
        const user = await userModel.findById(decoded.userId).select("+password");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        const hashPassword= await bcrypt.hash(newPassword,10);
        user.password = hashPassword;
        await user.save()
        await refreshTokenModel.deleteMany({
            user:user._id,
        })
        return res.status(200).json({
            success:true,
            message:"Password reset successfully. Please login again"
        })
    } catch (error) {
        return res.status(401).json({
            message:error.message
        })
    }
}
const resendOtp = async(req,res)=>{
    try {
        const {email} = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address.",
            });
        }
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified.",
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await emailOtpModel.deleteMany({
            email,
            purpose: "verify-email",
        });

        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        await emailOtpModel.create({
            email,
            otp,
            purpose: "verify-email",
            expiresAt: otpExpiry,
        });
    
        await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
        `,
        });
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully.",
        });
  } catch (error) {
    console.error("Error in resendOtp:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

}
const googleAuth = async (req, res) => {
  try {
    const {idToken}=req.body;
    if (!idToken) {
        return res.status(400).json({
            success: false,
            message: "Google ID Token is required.",
        });
    }
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience:process.env.GOOGLE_CLIENT_ID
    })
    const payload = await ticket.getPayload();
    let user = await userModel.findOne({
        email:payload.email
    })
    if(!user){
        user = await userModel.create({
            name:payload.name,
            email:payload.email,
            provider:"google",
            providerId:payload.sub,
            avatar:{
            url:payload.picture,
            publicId:null
        },
            isEmailVerified:true
        })
    }

    if (user.isBlocked) {
        return res.status(403).json({
            success: false,
            message: "Your account has been blocked."
        });
    }
    
    if(user.provider === "local"){
        user.provider = "google";
        user.providerId = payload.sub;
        user.avatar={
            url:payload.picture,
            publicId:null
        }
        await user.save();
    }
    console.log("user:", user);
    
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    await refreshTokenModel.create({
        user:user._id,
        token:refreshToken,
        expiresAt:new Date(Date.now() +30*24*60*60*1000)
    })

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:false,
        sameSite:"lax",
        maxAge:30*24*60*60*1000
    })
    return res.status(200).json({
        success: true,
        message: "Google login successful.",
        accessToken,
        userData:{
            name:payload.name,
            email:payload.email,
            avatar:user.avatar.url,
            role:user.role,
            date:user.createdAt,
            verified:user.isEmailVerified
        }
});
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports={
    register,
    verifyEmailOtp,
    login,
    refreshToken,
    logout,
    logoutAllDevices,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
    resendOtp,
    googleAuth
}