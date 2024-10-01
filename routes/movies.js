const { add_movie,
    update_movie,
    delete_movie,
    get_movie,
    get_random_movie,
    get_all_movie,
    add_review,
    delete_review,
    get_reviews_by_movieId,
    like_movie,
    dislike_movie, 
    get_related_movie} = require('../controllers/movieController')

const verify = require('../middleware/verifyToken')

const router = require('express').Router()


router.post('/', verify, add_movie)

router.put('/:id', verify, update_movie)

router.delete('/:id', verify, delete_movie)

router.get('/find/:id', verify, get_movie)

router.get('/random', verify, get_random_movie)

router.get('/related/:genre', get_related_movie);

router.get('/', verify, get_all_movie)

router.post('/review/:id', verify, add_review)

router.delete('/review/:id', verify, delete_review)

router.get('/review/:id', verify, get_reviews_by_movieId)

router.post('/likes/:id', verify, like_movie)

router.delete('/likes/:id', verify, dislike_movie)


module.exports = router