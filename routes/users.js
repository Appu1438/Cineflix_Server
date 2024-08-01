const { update_user, delete_user, get_user, all_user, user_stats } = require('../controllers/userController')
const verify = require('../middleware/verifyToken')

const router = require('express').Router()

//UPDATE
router.put('/:id', verify, update_user)
//DELETE
router.delete('/:id', verify, delete_user)
//GET
router.get('/find/:id', get_user)
//GET ALL USERS
router.get('/',verify, all_user)
//GET USER STATS
router.get('/stats',user_stats)



module.exports = router