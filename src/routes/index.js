import express from 'express'
import multer from 'multer';
//Controllers
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';
// Validations
import authValidation from '../validations/auth.validation.js';
import validate from '../middlewares/validate.js';
// Initialize routers
const router = express.Router();

/**
 * Upload image using multer
 */
const upload = multer({ 
  dest: "uploads/",
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+ '-'+file.originalname)
    }
  })
});

router.get("/users", userController.get)
router.get("/user/:id", userController.view)
router.post("/user",upload.single('profile'), userController.create)
router.put("/user/:id", userController.update)
router.delete("/user/:id", userController.delete)

router.post("/register",upload.single('profile'), authController.register)
router.post("/login",validate(authValidation.login), authController.login)
router.get("/verify-email/:token",validate(authValidation.verifyEmal), authController.verifyEmail)
router.post("/forgot-password",validate(authValidation.forgotPassword), authController.forgotPassword)
router.post("/reset-password",validate(authValidation.resetPassword), authController.changePassword)

export default router;