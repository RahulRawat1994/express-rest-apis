import multer from 'multer';

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

export default upload