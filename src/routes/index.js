import express from 'express'
import userController from '../controllers/userController.js';
const router = express.Router();
import multer from 'multer';
import authController from '../controllers/authController.js';

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
router.post("/login", authController.login)
router.get("/verify-email/:token", authController.verifyEmail)
router.post("/forgot-password", authController.forgotPassword)
router.post("/reset-password", authController.changePassword)
export default router;