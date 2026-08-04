const userModel = require("../models/user");
const { verifyAccessToken } = require("../utils/jwt");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            success:false,
            message:"Access token is requird"
        })
    }
    if(!authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            success:false,
            message:"Invalid authorization format"
        })
    }

    const accessToken = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(accessToken);

    const user = await userModel.findById(decoded.userId);
    if(!user){
        return res.status(401).json({
            success:false,
            message:"User not found"
        })
    }
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked"
    });
  }
    req.user=user;
    next();
  } catch (error) {
    console.log("Auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }
};

module.exports = authMiddleware;