const express = require('express');
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const router = express.Router();

router.get('/', auth, userCtrl.getUser);
router.patch('/', auth, userCtrl.modifyProfil);


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

router.patch('/follow/:id', auth, userCtrl.follow);
router.delete('/follow/:id', auth, userCtrl.unfollow);

router.post('/connect/:id', auth, userCtrl.sendConnectionRequest);
router.patch('/connect/:connectReqId', auth, userCtrl.responseConnectionRequest);

router.get('/network', auth, userCtrl.getNetworks);


module.exports = router;