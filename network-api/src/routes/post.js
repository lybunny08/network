const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const postCtrl = require('../controllers/post');

const router = express.Router();

router.post('/', auth, postCtrl.createPost);
router.get('/', auth, postCtrl.getPersonalsizedPosts);

router.get('/:id', auth, postCtrl.getOnePost);
router.patch('/:id', auth, postCtrl.modifyPost);
router.post('/:id', auth, postCtrl.likePost);
router.delete('/:id', auth, postCtrl.deletePost);

router.get('/user/:userId', auth, postCtrl.getUserPosts);

router.post('/:postId/comment', auth, multer, postCtrl.commentPost);
router.put('/:postId/comment/:commentId', auth, multer, postCtrl.modifyComment);
router.delete('/:postId/comment/:commentId', auth, postCtrl.deleteComment);

router.post('/:postId/comment/:commentId/reply', auth, multer, postCtrl.replyComment);
router.post('/:postId/comment/:commentId/reply/:replyId', auth, postCtrl.likeReply);
router.put('/:postId/comment/:commentId/reply/:replyId', auth, multer, postCtrl.modifyReply);
router.delete('/:postId/comment/:commentId/reply/:replyId', auth, multer, postCtrl.deleteReply);


module.exports = router;