const { register, login, refreshToken, get_User } = require('../controllers/authController')
const verify = require('../middleware/verifyToken')
const router = require('express').Router()

router.post("/register", register)

router.post('/login', login)

router.get('/profile', verify, get_User)

router.post('/refresh', refreshToken)



module.exports = router