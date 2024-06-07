const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const postCtrl = require('../controllers/post');

const router = express.Router();

router.post('/', auth, multer, postCtrl.createPost);

module.exports = router;