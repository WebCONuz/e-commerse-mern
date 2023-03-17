const router = require('express').Router();
const userCtrl = require("../controllers/userCtrls")
const auth = require("../middlewares/auth")

router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.get('/logout', userCtrl.logout)
router.get('/refresh_token', userCtrl.refreshToken)
router.get('/infor', auth, userCtrl.getUser)
router.patch('/addcart', auth, userCtrl.addCard)    

module.exports = router;