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

router.get('/find/:id', get_user)

router.get('/stats', user_stats)

router.use(verify)

router.put('/:id', update_user)

router.delete('/:id', delete_user)

router.get('/', all_user)

router.post('/fav/add', add_user_fav)

router.delete('/fav/delete', remove_user_fav)

router.get('/fav/:id', get_user_fav)

router.post('/history/add', add_movie_to_history)

router.delete('/history/delete', remove_movie_from_history)

router.get('/history/:id', get_user_history)

module.exports = router