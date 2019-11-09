const express = require('express');
const multer = require('multer');
const postsController = require('../controllers/post');
const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(".")[0]
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post('/create', multer({storage: storage}).single('image'), postsController.createPost);

router.get('/get-all', postsController.getAllPosts);

router.get('/get-by-date', postsController.getPostsByDate);

router.get('/get-id/:id', postsController.getPostById);

router.put('/update/:id', multer({storage: storage}).single('image'), postsController.updatePostById);

router.delete('/delete/:id', postsController.deletePostById);

module.exports = router;
