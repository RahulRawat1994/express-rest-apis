import express from 'express'
import upload from '../middlewares/upload.js';
//Controllers
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';
// Validations
import authValidation from '../validations/auth.validation.js';
import validate from '../middlewares/validate.js';

// Initialize routers
const router = express.Router();

router.get("/users", userController.get)
router.get("/user/:id", userController.view)
router.post("/user",upload.single('profile'), userController.create)
router.put("/user/:id", userController.update)
router.delete("/user/:id", userController.delete)

router.post("/register",validate(authValidation.register),upload.single('profile'), authController.register)
router.post("/login",validate(authValidation.login), authController.login)
router.get("/verify-email/:token",validate(authValidation.verifyEmal), authController.verifyEmail)
router.post("/forgot-password",validate(authValidation.forgotPassword), authController.forgotPassword)
router.post("/reset-password",validate(authValidation.resetPassword), authController.changePassword)

export default router;