const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const chatCtrl = require('../controllers/chat');

const router = express.Router();

router.get('/', auth, chatCtrl.getAllChat);

router.get('/search', auth, chatCtrl.searchChat);

router.get('/:id', auth, chatCtrl.getOneChat);
router.post('/:id', auth, multer, chatCtrl.chat);

module.exports = router;