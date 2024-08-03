const { add_movie,
    update_movie,
    delete_movie,
    get_movie,
    get_random_movie,
    get_all_movie } = require('../controllers/movieController')
    
const verify = require('../middleware/verifyToken')

const router = require('express').Router()


//ADD MOVIE
router.post('/', verify, add_movie)
//UPDATE
router.put('/:id', verify, update_movie)
//DELETE
router.delete('/:id', verify, delete_movie)
//GET MOVIE
router.get('/find/:id', verify, get_movie)
//GET RANDOM MOVIE
router.get('/random', verify, get_random_movie)
//GET ALL MOVIE
router.get('/', verify, get_all_movie)


module.exports = router