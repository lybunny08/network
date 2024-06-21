const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const chatCtrl = require('../controllers/chat');

const router = express.Router();

router.get('/', auth, chatCtrl.getNetwork);

module.exports = router;