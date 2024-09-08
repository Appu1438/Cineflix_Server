const { register, login, refreshToken, logout } = require('../controllers/authController')
const router = require('express').Router()

//REGISTER
router.post("/register", register)

//LOGIN
router.post('/login',login)

//Refresh
router.post('/refresh',refreshToken)

//Logout
router.post('/logout',logout)


module.exports = router