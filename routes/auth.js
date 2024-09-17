const { register, login, refreshToken } = require('../controllers/authController')
const router = require('express').Router()

//REGISTER
router.post("/register", register)

//LOGIN
router.post('/login',login)

//Refresh
router.post('/refresh',refreshToken)



module.exports = router