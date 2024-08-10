const { update_user,
    delete_user,
    get_user,
    all_user,
    user_stats,
    add_user_fav,
    remove_user_fav,
    get_user_fav,
    add_movie_to_history,
    remove_movie_from_history,
    get_user_history } = require('../controllers/userController')

const verify = require('../middleware/verifyToken')

const router = require('express').Router()

//GET
router.get('/find/:id', get_user)
//GET USER STATS
router.get('/stats', user_stats)

router.use(verify)
//UPDATE
router.put('/:id', update_user)
//DELETE
router.delete('/:id', delete_user)
//GET ALL USERS
router.get('/', all_user)
//ADD USER FAV
router.post('/fav/add', add_user_fav)
//REMOVE USER FAV
router.delete('/fav/delete', remove_user_fav)
//GET USER FAV
router.get('/fav/:id', get_user_fav)
//ADD USER HISTORY
router.post('/history/add', add_movie_to_history)
//REMOVE USER HISTORY
router.delete('/history/delete', remove_movie_from_history)
//GET USER HISTORY
router.get('/history/:id', get_user_history)

module.exports = router