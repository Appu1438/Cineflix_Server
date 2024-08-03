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

//UPDATE
router.put('/:id', verify, update_user)
//DELETE
router.delete('/:id', verify, delete_user)
//GET
router.get('/find/:id', get_user)
//GET ALL USERS
router.get('/', verify, all_user)
//GET USER STATS
router.get('/stats', user_stats)
//ADD USER FAV
router.post('/fav/add', verify, add_user_fav)
//REMOVE USER FAV
router.delete('/fav/delete', verify, remove_user_fav)
//GET USER FAV
router.get('/fav/:id', verify, get_user_fav)
//ADD USER HISTORY
router.post('/history/add', verify, add_movie_to_history)
//REMOVE USER HISTORY
router.delete('/history/delete', verify, remove_movie_from_history)
//GET USER HISTORY
router.get('/history/:id', verify, get_user_history)

module.exports = router