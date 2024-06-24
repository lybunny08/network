const express = require('express');
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const router = express.Router();

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

router.get('/user/:id', auth, userCtrl.getUser);
router.patch('/user/:id', auth, multer, userCtrl.modifyProfil);

router.patch('/follow/:userId', auth, userCtrl.follow);
router.delete('/follow/:userId', auth, userCtrl.unfollow);

router.get('/connect', auth, userCtrl.getConnectionRequests);
router.post('/connect/:userId', auth, userCtrl.sendConnectionRequest);
router.patch('/connect/:connectReqId', auth, userCtrl.responseConnectionRequest);

module.exports = router;