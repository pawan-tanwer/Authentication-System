const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controler.js");
const authLimiter = require("../middleware/rateLimiter.js")

router.post("/register",authController.register);
router.post("/verify-email-otp",authLimiter,authController.verifyEmailOtp);
router.post("/login" ,authLimiter,authController.login);
router.post("/refresh-token",authController.refreshToken);
router.post("/logout",authController.logout);
router.post("/logout-all-devices",authController.logoutAllDevices);
router.post("/forgot-password",authLimiter,authController.forgotPassword);
router.post("/verify-reset-otp",authLimiter,authController.verifyResetOtp);
router.patch("/reset-password",authController.resetPassword);
router.post("/resend-otp",authLimiter,authController.resendOtp)

// continue with google
router.post("/google",authController.googleAuth)

module.exports = router;