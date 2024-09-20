const { register, login, refreshToken, get_User } = require('../controllers/authController')
const verify = require('../middleware/verifyToken')
const router = require('express').Router()

//REGISTER
router.post("/register", register)

//LOGIN
router.post('/login', login)

router.get('/profile', verify, get_User)

//Refresh
router.post('/refresh', refreshToken)



module.exports = router