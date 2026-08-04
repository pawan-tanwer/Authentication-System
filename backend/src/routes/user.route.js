const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");
const userController = require("../controllers/user.controller.js");
const upload = require("../middleware/upload.middleware.js");
const router= express.Router();


//admin's routes
router.patch("/:id/role",authMiddleware,authorize("admin"), userController.updateUserRole);
router.get("/",authMiddleware,authorize("admin"),userController.getAllUser);
router.patch("/block/:id",authMiddleware,authorize("admin"),userController.blockOrUnblockUser);

//login user routes
router.get("/me",authMiddleware,userController.getMyProfile);
router.patch("/me",authMiddleware,userController.updateProfile);
router.patch("/change-password",authMiddleware,userController.changePassword);
router.patch("/avatar", authMiddleware,upload.single("avatar"),userController.updateAvatar);
router.post("/change-email",authMiddleware,userController.changeEmail);
router.post("/verify-email-otp",authMiddleware,userController.verifyEmailChange);

module.exports=router;