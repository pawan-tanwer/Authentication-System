const jwt = require("jsonwebtoken");
const { verify } = require("../config/email");

const generateAccessToken = (userId)=>{
    const token = jwt.sign({userId},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"15m"}
    )
    return token;
}

const generateRefreshToken = (userId)=>{
    const token = jwt.sign({userId},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:"30d"}
    )
    return token;
}

const generateResetToken = (userId)=>{
    const token = jwt.sign({userId},
        process.env.RESET_TOKEN_SECRET,
        {expiresIn:"10m"}
    )
    return token;
}

const verifyRefreshToken =(token)=>{
    return jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
}
const verifyAccessToken = (token)=>{
    return jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
}
const verifyResetToken=(token)=>{
    return jwt.verify(token,process.env.RESET_TOKEN_SECRET);
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateResetToken,
    verifyRefreshToken,
    verifyAccessToken,
    verifyResetToken

}