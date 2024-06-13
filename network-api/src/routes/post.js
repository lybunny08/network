const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const postCtrl = require('../controllers/post');

const router = express.Router();

router.post('/', auth, multer, postCtrl.createPost);
router.get('/', auth, postCtrl.getPersonalsizedPosts);

router.get('/:id', auth, postCtrl.getOnePost);
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.post('/:id', auth, postCtrl.likePost);
router.delete('/:id', auth, postCtrl.deletePost);

router.post('/comment/:postId', auth, multer, postCtrl.commentPost);
router.put('/comment/:postId', auth, multer, postCtrl.modifyComment);


module.exports = router;